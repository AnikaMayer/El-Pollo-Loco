import { AudioHub } from "../scripts/audio-hub.class.js";
import { DrawableObject } from "./drawable-object.class.js";

/**
 * Base class for all movable game objects.
 * Extends DrawableObject with physics, collision detection, animation and sound management.
 * @extends DrawableObject
 */
export class MovableObject extends DrawableObject {
    /** @type {number} The horizontal movement speed in pixels per frame. */
    speed = 0.15;
    /** @type {number} The vertical speed in pixels per frame. Positive = upward. */
    speedY = 0;
    /** @type {number} The gravitational acceleration applied each frame. */
    acceleration = 3;
    /** @type {boolean} Whether the object is mirrored horizontally (facing left). */
    otherDirection = false;
    /** @type {number} The current health points of the object. */
    energy = 100;
    /** @type {number} Timestamp of the last hit received in milliseconds. */
    lastHit = 0;
    /** @type {number} Timestamp of the last animation frame in milliseconds. */
    lastAnimation = 0;
    /** @type {boolean} Whether the object should keep falling (used for throwable objects). */
    keepFalling = false;
    /** @type {Object} Reference to the game world, set externally after creation. */
    world;
    /** @type {boolean} Whether the object performs a death jump when killed. */
    deathJump = false;
    /** @type {boolean} Whether the object is currently moving left. */
    movingLeft;
    /** @type {boolean} Whether the death or splash sound has already been played. */
    soundPlayed = false;
    /** @type {number} The real x-position of the hitbox after applying offsets. */
    rX;
    /** @type {number} The real y-position of the hitbox after applying offsets. */
    rY;
    /** @type {number} The real width of the hitbox after applying offsets. */
    rW;
    /** @type {number} The real height of the hitbox after applying offsets. */
    rH;

    /**
     * Calculates and stores the real hitbox dimensions based on the object's
     * position, size and offsets.
     */
    getRealFrame() {
        this.rX = this.x + this.offset.left;
        this.rY = this.y + this.offset.top;
        this.rW = this.width - this.offset.left - this.offset.right;
        this.rH = this.height - this.offset.top - this.offset.bottom;
    }

    /**
     * Applies gravity each frame by reducing vertical speed and moving the object downward.
     * Stops if the object is dead and not set to keep falling.
     * Object lands at the same height as at the start.
     * @type {Function}
     */
    applyGravity = () => {
        if (this.isDead() && !this.keepFalling) {
            return;
        }
        if (this.isAboveGround() || this.speedY > 0) {
            this.y -= this.speedY;
            this.speedY -= this.acceleration;
            if (this.y >= 180 && !this.keepFalling) {
                this.y = 180;
                this.speedY = 0;
            }
        }
    };

    /**
     * Checks whether the object is above the ground level (y < 180).
     * Throwable objects always return true so they keep falling until they hit the ground.
     * @returns {boolean} True if the object is above ground or is a throwable object.
     */
    isAboveGround() {
        if (this.keepFalling) {
            return true;
        } else {
            return this.y < 180;
        }
    }

    /**
     * Checks whether this object's hitbox overlaps with another movable object's hitbox.
     * Returns false if this object is dead.
     * @param {MovableObject} mO - The other movable object to check collision against.
     * @returns {boolean} True if the two hitboxes overlap.
     */
    isColliding(mO) {
        if (!this.isDead()) {
            this.getRealFrame();
            mO.getRealFrame();
            return (
                this.rX + this.rW > mO.rX &&
                this.rY + this.rH > mO.rY &&
                this.rX < mO.rX + mO.rW &&
                this.rY < mO.rY + mO.rH
            );
        }
    }

    /**
     * Checks whether this object is colliding with another object from above.
     * Requires the object to be falling (speedY < 0), above ground, and the target to be alive.
     * @param {MovableObject} mO - The object to check against.
     * @returns {boolean} True if this object is landing on top of the given object.
     */
    isCollidingFromAbove(mO) {
        return (
            this.isColliding(mO) &&
            this.speedY < 0 &&
            this.isAboveGround() &&
            !mO.isDead()
        );
    }

    /**
     * Repositions this object on top of the given object and triggers a bounce.
     * Called when the character jumps on an enemy.
     * @param {MovableObject} mO - The object that was landed on.
     */
    jumpOnMovObj(mO) {
        this.y = mO.y + mO.offset.top - this.height + this.offset.bottom;
        this.bounce();
    }

    /**
     * Checks whether the character landed on an enemy within the last 200 milliseconds.
     * Used to prevent damage collision from triggering immediately after a jump-on.
     * @returns {boolean} True if less than 200ms have passed since the last jump-on.
     */
    justJumpedOnEnemy() {
        return new Date().getTime() - this.lastJumpedOn < 200;
    }

    /**
     * Reduces the object's energy by the given damage value.
     * Triggers a death jump if energy reaches zero and deathJump is enabled.
     * @param {number} damage - The amount of damage to deal.
     */
    hit(damage) {
        this.energy -= damage;
        if (this.energy < 0) {
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();
        }
        if (this.energy === 0) {
            this.speed = 0;
            if (this.deathJump) {
                this.keepFalling = true;
                this.speedY = 30;
            }
        }
    }

    /**
     * Checks whether the object was hit within the last second.
     * Used to prevent multiple hits in quick succession and to trigger hurt animations.
     * @returns {boolean} True if the object was hit less than 1 second ago.
     */
    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit;
        timepassed = timepassed / 1000;
        return timepassed < 1;
    }

    /**
     * Checks whether the object is dead.
     * @returns {boolean} True if energy has reached zero.
     */
    isDead() {
        return this.energy === 0;
    }

    /**
     * Advances the animation by one frame if enough time has passed since the last frame.
     * Loops through the given image array continuously.
     * @param {string[]} images - The array of image paths for the animation.
     * @param {number} animationSpeed - Minimum time in milliseconds between frames.
     */
    playAnimation(images, animationSpeed) {
        if (this.animateNext(animationSpeed)) {
            let i = this.currentImage % images.length;
            let path = images[i];
            this.img = this.imageCache[path];
            this.currentImage++;
            this.lastAnimation = new Date().getTime();
        }
    }

    /**
     * Checks whether enough time has passed to advance to the next animation frame.
     * @param {number} animationSpeed - Minimum time in milliseconds between frames.
     * @returns {boolean} True if the next frame should be played.
     */
    animateNext(animationSpeed) {
        let timepassed = new Date().getTime() - this.lastAnimation;
        return timepassed > animationSpeed;
    }

    /**
     * Plays or stops a sound depending on a condition.
     * Delegates to AudioHub's toggle methods.
     * @param {HTMLAudioElement} sound - The audio element to play or stop.
     * @param {boolean} playing - Whether the sound should currently be playing.
     */
    playSound(sound, playing) {
        if (playing) {
            AudioHub.playOne(sound);
        } else {
            AudioHub.stopOne(sound);
        }
    }

    /**
     * Moves the object to the right by its current speed.
     */
    moveRight() {
        this.x += this.speed;
    }

    /**
     * Moves the object to the left by its current speed.
     */
    moveLeft() {
        this.x -= this.speed;
    }

    /**
     * Makes the object jump by setting a high upward vertical speed.
     */
    jump() {
        this.speedY = 30;
    }

    /**
     * Makes the object perform a small bounce, used after landing on an enemy.
     */
    bounce() {
        this.speedY = 20;
    }
}
