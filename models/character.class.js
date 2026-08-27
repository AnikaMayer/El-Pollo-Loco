import { AudioHub } from "../scripts/audio-hub.class.js";
import { ImageHub } from "../scripts/img-hub.class.js";
import { IntervalHub } from "../scripts/intervall-hub.class.js";
import { MovableObject } from "./movable-object.class.js";

export class Character extends MovableObject {
    y = 80;
    height = 250;
    speed = 10;
    imgPath = ImageHub.PEPE;
    audioPath = AudioHub.CHARACTER;
    world;
    showFrame = true;
    offset = {
        top: 120,
        right: 27,
        bottom: 17,
        left: 25,
    };

    constructor() {
        super().loadImage(this.imgPath.walk[0]);
        this.loadImages(this.imgPath.walk);
        this.loadImages(this.imgPath.jump);
        this.loadImages(this.imgPath.dead);
        this.loadImages(this.imgPath.hurt);
        this.applyGravity();
        IntervalHub.startInterval(this.applyGravity, 1000 / 25);
        IntervalHub.startInterval(this.moveCharacter, 1000 / 60);
        IntervalHub.startInterval(this.animateCharacter, 1000 / 20);
        IntervalHub.startInterval(this.playSounds, 1000 / 60);
        this.getRealFrame();
    }

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
        this.world.camera_x = -this.x + 100; //Map wird gegenteilig zum Character verschoben
    };

    playSounds = () => {
        const audio = this.audioPath;
        this.toggleSound(
            audio.walk,
            this.world.keyboard.LEFT || this.world.keyboard.RIGHT,
        );
        this.toggleSound(audio.jump, this.isAboveGround());
    };

    toggleSound(sound, playing) {
        if (playing) {
            AudioHub.playOne(sound);
        } else {
            AudioHub.stopOne(sound);
        }
    }

    animateCharacter = () => {
        if (this.isDead()) {
            this.playAnimation(this.imgPath.dead); //dead animation
        } else if (this.isHurt()) {
            this.playAnimation(this.imgPath.hurt);
        } else if (this.isAboveGround()) {
            this.playAnimation(this.imgPath.jump); //jump animation
        } else {
            if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
                this.playAnimation(this.imgPath.walk); //walk animation
            }
        }
    };

    jump() {
        this.speedY = 30;
    }
}
