import { AudioHub } from "../scripts/audio-hub.class.js";
import { ImageHub } from "../scripts/img-hub.class.js";
import { IntervalHub } from "../scripts/intervall-hub.class.js";
import { MovableObject } from "./movable-object.class.js";

/**
 * Represents the player character (Pepe) in the game.
 * Handles movement, jumping, animations, sounds and idle behavior.
 * @extends MovableObject
 */
export class Character extends MovableObject {
    /** @type {number} The y-position of the character in pixels. */
    y = 180;
    /** @type {number} The height of the character in pixels. */
    height = 250;
    /** @type {number} The movement speed of the character in pixels per frame. */
    speed = 10;
    /** @type {number} The health points of the character. */
    energy = 100;
    /** @type {Object} The image paths for all character animations, loaded from the ImageHub. */
    imgPath = ImageHub.PEPE;
    /** @type {Object} The audio paths for all character sounds, loaded from the AudioHub. */
    audioPath = AudioHub.CHARACTER;
    /** @type {boolean} Whether the character should perform a death jump animation. */
    deathJump = true;
    /** @type {number} Timestamp of the last movement or action, used to track idle time. */
    idleStart = new Date().getTime();
    /** @type {number} Timestamp of the last time the character landed on an enemy, used to suppress regular collision damage briefly. */
    lastJumpedOn = 0;
    /**
     * Hitbox offsets in pixels to fine-tune collision detection.
     * @type {{ top: number, right: number, bottom: number, left: number }}
     */
    offset = {
        top: 120,
        right: 27,
        bottom: 17,
        left: 25,
    };

    /**
     * Creates a new Character, loads all animation images, applies gravity
     * and starts all movement, animation and sound intervals.
     */
    constructor() {
        super().loadImage(this.imgPath.idle[0]);
        this.loadImages(this.imgPath.walk);
        this.loadImages(this.imgPath.jump);
        this.loadImages(this.imgPath.dead);
        this.loadImages(this.imgPath.hurt);
        this.loadImages(this.imgPath.idle);
        this.loadImages(this.imgPath.longIdle);
        IntervalHub.startInterval(this.applyGravity, 1000 / 25);
        IntervalHub.startInterval(this.moveCharacter, 1000 / 60);
        IntervalHub.startInterval(this.animateCharacter, 1000 / 20);
        IntervalHub.startInterval(this.characterSound, 1000 / 60);
        this.getRealFrame();
    }

    /**
     * Moves the character each frame based on keyboard input.
     * Also updates the camera position to follow the character.
     * @type {Function}
     */
    moveCharacter = () => {
        if (
            this.world.keyboard.RIGHT &&
            this.x < this.world.level.level_end_x
        ) {
            this.moveRight();
            this.otherDirection = false;
        }
        if (this.world.keyboard.LEFT && this.x > 0) {
            this.moveLeft();
            this.otherDirection = true;
        }
        if (this.world.keyboard.SPACE && !this.isAboveGround()) {
            this.jump();
        }
        this.world.camera_x = -this.x + 100;
    };

    /**
     * Plays the damage sound once per hit, but only while the character is alive.
     */
    playDamageSound() {
        if (
            this.isHurt() &&
            this.lastHit !== this.lastHitSoundPlayed &&
            !this.isDead()
        ) {
            this.lastHitSoundPlayed = this.lastHit;
            AudioHub.playOne(this.audioPath.damage);
        }
    }

    /**
     * Manages all character sounds based on the current state and keyboard input.
     * Uses the toggle method in MovableObject for looping sounds.
     * @type {Function}
     */
    characterSound = () => {
        const audio = this.audioPath;
        this.playSound(
            audio.walk,
            (this.world.keyboard.LEFT || this.world.keyboard.RIGHT) &&
                !this.isAboveGround(),
        );
        this.playSound(audio.jump, this.world.keyboard.SPACE);
        this.playDamageSound();
        this.playSound(audio.dead, this.isDead());
        this.playSound(audio.snoring, this.checkTimeForIdle());
    };

    /**
     * Plays the appropriate animation based on the character's current state.
     * Priority: dead → hurt → jumping → walking → idle.
     * Resets the idle timer on any active movement or action.
     * @type {Function}
     */
    animateCharacter = () => {
        if (this.isDead()) {
            this.playAnimation(this.imgPath.dead, 200);
        } else if (this.isHurt()) {
            this.playAnimation(this.imgPath.hurt, 45);
            this.idleStart = new Date().getTime();
        } else if (this.isAboveGround()) {
            this.playAnimation(this.imgPath.jump, 55);
            this.idleStart = new Date().getTime();
        } else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
            this.playAnimation(this.imgPath.walk, 20);
            this.idleStart = new Date().getTime();
        } else {
            this.idleAnimation();
        }
    };

    /**
     * Plays the long idle animation with snoring after 15 seconds of inactivity,
     * or the regular idle animation otherwise.
     */
    idleAnimation() {
        if (this.checkTimeForIdle()) {
            this.playAnimation(this.imgPath.longIdle, 200);
        } else {
            this.playAnimation(this.imgPath.idle, 250);
        }
    }

    /**
     * Checks whether the character has been idle for more than 15 seconds.
     * @returns {boolean} True if idle time exceeds 15 seconds, false otherwise.
     */
    checkTimeForIdle() {
        let timepassed = new Date().getTime() - this.idleStart;
        timepassed = timepassed / 1000;
        return timepassed > 15;
    }

    /**
     * Makes the character jump by setting a positive vertical speed
     * and resetting the animation frame to the beginning.
     */
    jump() {
        this.speedY = 30;
        this.currentImage = 0;
    }
}
