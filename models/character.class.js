import { AudioHub } from "../scripts/audio-hub.class.js";
import { ImageHub } from "../scripts/img-hub.class.js";
import { IntervalHub } from "../scripts/intervall-hub.class.js";
import { MovableObject } from "./movable-object.class.js";

export class Character extends MovableObject {
    y = 80;
    height = 250;
    speed = 10;
    energy = 100;
    imgPath = ImageHub.PEPE;
    audioPath = AudioHub.CHARACTER;
    deathJump = true;
    // showFrame = true;
    idleStart = new Date().getTime();
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
        this.loadImages(this.imgPath.idle);
        this.loadImages(this.imgPath.longIdle);
        this.applyGravity();
        IntervalHub.startInterval(this.applyGravity, 1000 / 25);
        IntervalHub.startInterval(this.moveCharacter, 1000 / 60);
        IntervalHub.startInterval(this.animateCharacter, 1000 / 20);
        // IntervalHub.startInterval(this.characterSound, 1000 / 60);
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

    // Char-Sounds gemanaged über toggle-methode in MovableObj -> dafür Path übergeben mit Bedingung
    characterSound = () => {
        const audio = this.audioPath;
        this.playSound(
            audio.walk,
            (this.world.keyboard.LEFT || this.world.keyboard.RIGHT) &&
                !this.isAboveGround(),
        );
        this.playSound(audio.jump, this.isAboveGround());
        this.playSound(audio.damage, this.isHurt());
        this.playSound(audio.dead, this.isDead());
    };

    animateCharacter = () => {
        if (this.isDead()) {
            this.playAnimation(this.imgPath.dead, 200); //dead animation
        } else if (this.isHurt()) {
            this.playAnimation(this.imgPath.hurt, 45);
            this.idleStart = new Date().getTime();
        } else if (this.isAboveGround()) {
            this.playAnimation(this.imgPath.jump, 55); //jump animation
            this.idleStart = new Date().getTime();
        } else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
            this.playAnimation(this.imgPath.walk, 20); //walk animation
            this.idleStart = new Date().getTime();
        } else {
            this.idleAnimation();
        }
    };

    idleAnimation() {
        if (this.checkTimeForIdle()) {
            this.playAnimation(this.imgPath.longIdle, 200);
        } else {
            this.playAnimation(this.imgPath.idle, 250);
        }
    }

    checkTimeForIdle() {
        let timepassed = new Date().getTime() - this.idleStart;
        timepassed = timepassed / 1000;
        return timepassed > 15;
    }

    jump() {
        this.speedY = 30;
        this.currentImage = 0;
    }
}
