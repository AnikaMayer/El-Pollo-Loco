import { AudioHub } from "../scripts/audio-hub.class.js";
import { ImageHub } from "../scripts/img-hub.class.js";
import { IntervalHub } from "../scripts/intervall-hub.class.js";
import { MovableObject } from "./movable-object.class.js";

export class Chicken extends MovableObject {
    y = 360;
    width = 80;
    height = 60;
    imgPath = ImageHub.CHICKEN;
    audioPath = AudioHub.ENEMIES.deadChicken;
    // showFrame = true;
    offset = {
        top: 10,
        right: 10,
        bottom: 5,
        left: 10,
    };

    constructor() {
        super().loadImage(this.imgPath.walk[0]);
        this.loadImages(this.imgPath.walk);
        this.loadImages(this.imgPath.dead);
        this.movingLeft = Math.random() >= 0.5 ? true : false;
        this.x = 370 + Math.random() * 3000;
        this.speed = 0.15 + Math.random() * 0.5;
        IntervalHub.startInterval(this.moveChicken, 1000 / 60);
        IntervalHub.startInterval(this.animateChicken, 1000 / 5);
        IntervalHub.startInterval(this.chickenSound, 1000 / 60);
        this.getRealFrame();
    }

    // läuft in eine zufällige Richtung mit zufälligem Wechsel, stoppt an der Grenze der Map
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

    //bestimmt zufällig eine neue Richtung
    randomDirection() {
        if (Math.random() < 0.0015) {
            this.movingLeft = !this.movingLeft;
            this.otherDirection = !this.otherDirection;
        }
    }

    //dreht am Ende wieder um
    stopAtMapEnd() {
        if (this.x <= 120 && this.movingLeft) {
            this.movingLeft = false;
        } else if (this.x >= 3000 && !this.movingLeft) {
            this.movingLeft = true;
        }
    }

    // Sounds gemanaged über toggle-methode in MovableObj -> dafür Path übergeben mit Bedingung
    chickenSound = () => {
        const audio = this.audioPath;
        if (this.isDead() && !this.soundPlayed) {
            this.soundPlayed = true;
            this.playSound(audio, this.isDead());
        }
    };

    animateChicken = () => {
        if (this.isDead()) {
            // wenn isDead() zurückgegeben aus movableObj
            this.playAnimation(this.imgPath.dead, 0); // dead-animation
        } else {
            this.playAnimation(this.imgPath.walk, 0); //walk animation
        }
    };
}
