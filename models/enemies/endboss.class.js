import { AudioHub } from "../../scripts/audio-hub.class.js";
import { ImageHub } from "../../scripts/img-hub.class.js";
import { IntervalHub } from "../../scripts/intervall-hub.class.js";
import { MovableObject } from "../movable-object.class.js";

/**
 * Represents the endboss of the game.
 * Cycles through walk, alert and attack states, always moves toward the character,
 * and plays corresponding animations and sounds.
 * @extends MovableObject
 */
export class Endboss extends MovableObject {
    /** @type {number} The y-position of the endboss in pixels. */
    y = 55;
    /** @type {number} The width of the endboss in pixels. */
    width = 250;
    /** @type {number} The height of the endboss in pixels. */
    height = 400;
    /** @type {number} The current movement speed of the endboss. */
    speed = 2;
    /** @type {number} The base movement speed, used to reset speed after the attack state. */
    baseSpeed = this.speed;
    /** @type {Object} The image paths for all animations, loaded from the ImageHub. */
    imgPath = ImageHub.BOSS;
    /** @type {Object} The audio paths for all sounds, loaded from the AudioHub. */
    audioPath = AudioHub.ENEMIES;
    /** @type {boolean} Whether the player has triggered the endboss encounter. */
    encounter = false;
    /** @type {boolean} Whether the endboss is currently moving left. */
    movingLeft = true;
    /** @type {number} Timestamp of the last state change, used for state timing. */
    timepassed = new Date().getTime();
    /**
     * The current animation/behavior state of the endboss.
     * @type {'walk' | 'alert' | 'attack'}
     */
    state = "walk";
    /**
     * Hitbox offsets in pixels to fine-tune collision detection.
     * @type {{ top: number, right: number, bottom: number, left: number }}
     */
    offset = {
        top: 80,
        right: 40,
        bottom: 80,
        left: 40,
    };

    /**
     * Creates a new Endboss at x-position 5000, loads all animation images
     * and starts its movement, animation and sound intervals.
     */
    constructor() {
        super().loadImage(this.imgPath.alert[0]);
        this.loadImages(this.imgPath.walk);
        this.loadImages(this.imgPath.alert);
        this.loadImages(this.imgPath.dead);
        this.loadImages(this.imgPath.hurt);
        this.loadImages(this.imgPath.attack);
        this.x = 5000;
        IntervalHub.startInterval(this.moveEndboss, 1000 / 60);
        IntervalHub.startInterval(this.animate, 1000 / 5);
        IntervalHub.startInterval(this.endbossSound, 1000 / 60);
        this.getRealFrame();
    }

    /**
     * Moves the endboss each frame once the encounter has been triggered.
     * Always moves toward the character and stays within map boundaries.
     * @type {Function}
     */
    moveEndboss = () => {
        if (this.encounter === true && !this.isNearCharacter()) {
            this.moveToCharacter();
            if (this.movingLeft) {
                this.moveLeft();
                this.otherDirection = false;
            } else {
                this.moveRight();
                this.otherDirection = true;
            }
            this.stopAtMapEnd();
        }
    };

    /**
     * Checks whether the endboss is close enough to the character horizontally
     * that further movement would cause it to overshoot and oscillate.
     * @returns {boolean} True if the distance between center points is within one movement step.
     */
    isNearCharacter() {
        const bossMid = this.x + this.width / 2;
        const charMid = this.world.character.x + this.world.character.width / 2;
        return Math.abs(bossMid - charMid) <= this.speed;
    }

    /**
     * Updates the movement direction so the endboss always faces and moves toward the character,
     * based on their center points.
     */
    moveToCharacter() {
        const bossMid = this.x + this.width / 2;
        const charMid = this.world.character.x + this.world.character.width / 2;
        if (bossMid > charMid) {
            this.movingLeft = true;
        } else if (bossMid < charMid) {
            this.movingLeft = false;
        }
    }

    /**
     * Prevents the endboss from leaving the map on the left side.
     * No right-side boundary is needed since moveToCharacter already
     * keeps the endboss oriented toward the character during the encounter.
     */
    stopAtMapEnd() {
        if (this.x <= 120 && this.movingLeft) {
            this.movingLeft = false;
        }
    }

    /**
     * Manages endboss sounds based on the current state.
     * Plays the approach sound during the alert state and the death sound once when killed.
     * @type {Function}
     */
    endbossSound = () => {
        const audio = this.audioPath;
        this.playSound(
            audio.bossApproach,
            this.state === "alert" && !this.isDead(),
        );
        if (this.isDead() && !this.soundPlayed) {
            this.soundPlayed = true;
            this.playSound(audio.bossDead, this.isDead());
        }
    };

    /**
     * Plays the appropriate animation based on the endboss's current state.
     * Prioritizes dead and hurt animations over movement animations.
     * @type {Function}
     */
    animate = () => {
        if (this.isDead()) {
            this.playAnimation(this.imgPath.dead, 0);
        } else if (this.isHurt()) {
            this.playAnimation(this.imgPath.hurt, 0);
        } else {
            this.animateBossMovement();
        }
    };

    /**
     * Plays the animation for the current movement state (walk, alert or attack)
     * and checks whether it is time to transition to the next state.
     */
    animateBossMovement() {
        const newTime = new Date().getTime();
        const timing = this.getTiming();
        if (this.state === "walk") {
            this.playAnimation(this.imgPath.walk, 0);
        } else if (this.state === "alert") {
            this.playAnimation(this.imgPath.alert, 0);
        } else {
            this.playAnimation(this.imgPath.attack, 0);
        }
        this.checkTimePassed(newTime, timing);
    }

    /**
     * Returns how long the current state should last before transitioning to the next one.
     * @returns {number} Duration in milliseconds — 4000 for walk, 2000 for alert, 3000 for attack.
     */
    getTiming() {
        if (this.state === "walk") {
            return 4000;
        } else if (this.state === "alert") {
            return 2000;
        } else {
            return 3000;
        }
    }

    /**
     * Checks whether the current state's duration has elapsed and transitions to the next state.
     * Adjusts speed accordingly: zero during alert and attack, restored to base speed on walk.
     * @param {number} newTime - The current timestamp in milliseconds.
     * @param {number} timing - The duration the current state should last in milliseconds.
     */
    checkTimePassed(newTime, timing) {
        if (this.encounter === true && newTime - this.timepassed > timing) {
            if (this.state === "walk") {
                this.speed = 0;
                this.state = "alert";
            } else if (this.state === "alert") {
                this.speed = 0;
                this.state = "attack";
            } else {
                this.speed = this.baseSpeed;
                this.state = "walk";
            }
            this.timepassed = new Date().getTime();
        }
    }
}
