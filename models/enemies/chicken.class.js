import { AudioHub } from "../../scripts/audio-hub.class.js";
import { ImageHub } from "../../scripts/img-hub.class.js";
import { IntervalHub } from "../../scripts/intervall-hub.class.js";
import { MovableObject } from "../movable-object.class.js";

/**
 * Represents a chicken enemy that walks randomly left and right across the map.
 * Plays a death sound and switches to a dead animation when killed.
 * @extends MovableObject
 */
export class Chicken extends MovableObject {
    /** @type {number} The y-position of the chicken in pixels. */
    y = 360;
    /** @type {number} The width of the chicken in pixels. */
    width = 80;
    /** @type {number} The height of the chicken in pixels. */
    height = 60;
    /** @type {Object} The image paths for all animations, loaded from the ImageHub. */
    imgPath = ImageHub.CHICKEN;
    /** @type {HTMLAudioElement} The audio path for the death sound, loaded from the AudioHub. */
    audioPath = AudioHub.ENEMIES.deadChicken;
    /**
     * Hitbox offsets in pixels to fine-tune collision detection.
     * @type {{ top: number, right: number, bottom: number, left: number }}
     */
    offset = {
        top: 10,
        right: 10,
        bottom: 5,
        left: 10,
    };

    /**
     * Creates a new Chicken at a random position with a random speed and direction,
     * and starts its movement, animation and sound intervals.
     */
    constructor() {
        super().loadImage(this.imgPath.walk[0]);
        this.loadImages(this.imgPath.walk);
        this.loadImages(this.imgPath.dead);
        this.movingLeft = Math.random() >= 0.5 ? true : false;
        this.x = 370 + Math.random() * 4400;
        this.speed = 0.15 + Math.random() * 0.5;
        IntervalHub.startInterval(this.moveChicken, 1000 / 60);
        IntervalHub.startInterval(this.animateChicken, 1000 / 5);
        IntervalHub.startInterval(this.chickenSound, 1000 / 60);
        this.getRealFrame();
    }

    /**
     * Moves the chicken each frame.
     * Chooses a random direction, moves accordingly and prevents leaving the map boundaries.
     * @type {Function}
     */
    moveChicken = () => {
        this.randomDirection();
        if (this.movingLeft) {
            this.moveLeft();
            this.otherDirection = false;
        } else {
            this.moveRight();
            this.otherDirection = true;
        }
        this.stopAtMapEnd();
    };

    /**
     * Randomly reverses the chicken's movement direction.
     * Has a small chance (0.15%) of toggling direction on each call.
     */
    randomDirection() {
        if (Math.random() < 0.0015) {
            this.movingLeft = !this.movingLeft;
            this.otherDirection = !this.otherDirection;
        }
    }

    /**
     * Prevents the chicken from leaving the map boundaries.
     * Reverses direction when reaching the left (x ≤ 120) or right (x ≥ 4400) edge.
     */
    stopAtMapEnd() {
        if (this.x <= 120 && this.movingLeft) {
            this.movingLeft = false;
        } else if (this.x >= 4400 && !this.movingLeft) {
            this.movingLeft = true;
        }
    }

    /**
     * Plays the death sound once when the chicken dies.
     * Uses the toggle method in MovableObject to manage audio playback.
     * @type {Function}
     */
    chickenSound = () => {
        const audio = this.audioPath;
        if (this.isDead() && !this.soundPlayed) {
            this.soundPlayed = true;
            this.playSound(audio, this.isDead());
        }
    };

    /**
     * Plays the walk or dead animation depending on the chicken's current state.
     * @type {Function}
     */
    animateChicken = () => {
        if (this.isDead()) {
            this.playAnimation(this.imgPath.dead, 0);
        } else {
            this.playAnimation(this.imgPath.walk, 0);
        }
    };
}
