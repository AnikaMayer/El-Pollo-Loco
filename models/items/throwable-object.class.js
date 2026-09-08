import { AudioHub } from "../../scripts/audio-hub.class.js";
import { ImageHub } from "../../scripts/img-hub.class.js";
import { IntervalHub } from "../../scripts/intervall-hub.class.js";
import { MovableObject } from "../movable-object.class.js";

/**
 * Represents a throwable bottle object in the game.
 * Flies in the direction the character is facing, falls with gravity,
 * and plays a splash animation with sound on impact.
 * @extends MovableObject
 */
export class ThrowableObject extends MovableObject {
    /** @type {Object} The image paths for all bottle sprites, loaded from the ImageHub. */
    imgPath = ImageHub.BOTTLE;
    /** @type {boolean} Whether the bottle should continue falling due to gravity. */
    keepFalling = true;
    /** @type {boolean} Whether the bottle is currently playing the splash animation. */
    isSplashing = false;
    /** @type {boolean} Whether the bottle should be removed from the game world after splashing. */
    removeBottle = false;
    /** @type {Object} The audio paths for item sounds, loaded from the AudioHub. */
    audioPath = AudioHub.ITEMS;
    /**
     * Hitbox offsets in pixels to fine-tune collision detection.
     * @type {{ top: number, right: number, bottom: number, left: number }}
     */
    offset = {
        top: 10,
        right: 15,
        bottom: 10,
        left: 15,
    };

    /**
     * Creates a new ThrowableObject and immediately throws it.
     * @param {number} x - The starting x-position of the bottle.
     * @param {number} y - The starting y-position of the bottle.
     * @param {boolean} _otherDirection - Whether the bottle should fly to the left (true) or right (false).
     */
    constructor(x, y, _otherDirection) {
        super().loadImage(this.imgPath.rotation[0]);
        this.loadImages(this.imgPath.rotation);
        this.loadImages(this.imgPath.splash);
        this.x = x;
        this.y = y;
        this.otherDirection = _otherDirection;
        this.width = 50;
        this.height = 60;
        this.throw();
        this.getRealFrame();
    }

    /**
     * Initializes the throw by setting vertical speed and starting all movement,
     * animation and sound intervals.
     */
    throw() {
        this.speedY = 10;
        IntervalHub.startInterval(this.applyGravity, 1000 / 25);
        IntervalHub.startInterval(this.flyingBottle, 1000 / 40);
        IntervalHub.startInterval(this.animateThrowObj, 1000 / 10);
        IntervalHub.startInterval(this.itemSound, 1000 / 60);
    }

    /**
     * Moves the bottle horizontally each frame.
     * Triggers a splash when the bottle hits the ground (y ≥ 360).
     * Stops all horizontal movement once the bottle is dead.
     * @type {Function}
     */
    flyingBottle = () => {
        if (this.isDead()) {
            return;
        } else if (this.y >= 360) {
            this.stopFalling();
            this.y = 360;
            this.keepFalling = false;
            this.hit(100);
            this.splash();
        }
        this.flyingDirection();
    };

    /**
     * Moves the bottle left or right depending on the throw direction.
     */
    flyingDirection() {
        if (this.otherDirection === false) {
            this.x += 10;
        } else if (this.otherDirection === true) {
            this.x -= 10;
        }
    }

    /**
     * Stops the bottle from falling by resetting vertical speed and disabling gravity.
     */
    stopFalling() {
        this.keepFalling = false;
        this.speedY = 0;
    }

    /**
     * Triggers the splash sequence: starts the splash animation and schedules
     * the bottle for removal after the animation completes (~667ms).
     */
    splash() {
        this.isSplashing = true;
        this.currentImage = 0;
        setTimeout(() => {
            this.removeBottle = true;
        }, 1000 / 1.5);
    }

    /**
     * Plays the splash sound once when the bottle hits the ground.
     * Uses the toggle method in MovableObject to manage audio playback.
     * @type {Function}
     */
    itemSound = () => {
        const audio = this.audioPath;
        if (this.isSplashing && !this.soundPlayed) {
            this.soundPlayed = true;
            this.playSound(audio.splash, this.isSplashing);
        }
    };

    /**
     * Plays the rotation animation while the bottle is in flight,
     * and switches to the splash animation on impact until it finishes.
     * @type {Function}
     */
    animateThrowObj = () => {
        if (
            this.isSplashing &&
            this.currentImage < this.imgPath.splash.length
        ) {
            this.playAnimation(this.imgPath.splash, 0);
        } else if (!this.isSplashing) {
            this.playAnimation(this.imgPath.rotation, 0);
        }
    };
}
