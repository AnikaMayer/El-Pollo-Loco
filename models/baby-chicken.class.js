import { AudioHub } from "../scripts/audio-hub.class.js";
import { ImageHub } from "../scripts/img-hub.class.js";
import { IntervalHub } from "../scripts/intervall-hub.class.js";
import { MovableObject } from "./movable-object.class.js";

export class BabyChicken extends MovableObject {
    y = 370;
    width = 50;
    height = 50;
    energy = 50;
    imgPath = ImageHub.BABYCHICKEN;
    audioPath = AudioHub.ENEMIES.deadBabyChicken;
    // showFrame = true;
    offset = {
        top: 10,
        right: 10,
        bottom: 7,
        left: 10,
    };

    constructor() {
        super().loadImage(this.imgPath.walk[0]);
        this.loadImages(this.imgPath.walk);
        this.loadImages(this.imgPath.dead);
        this.movingLeft = Math.random() >= 0.5 ? true : false;
        this.x = 420 + Math.random() * 2900;
        this.speed = 0.15 + Math.random() * 0.5;
        IntervalHub.startInterval(this.moveBabyChicken, 1000 / 60);
        IntervalHub.startInterval(this.animateBabyChicken, 1000 / 5);
        // IntervalHub.startInterval(this.babyChickenSound, 1000 / 60);
        this.getRealFrame();
    }

    // läuft in eine zufällige Richtung mit zufälligem Wechsel, stoppt an der Grenze der Map
    moveBabyChicken = () => {
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
    babyChickenSound = () => {
        const audio = this.audioPath;
        this.playSound(audio, this.isDead());
    };

    animateBabyChicken = () => {
        if (this.isDead()) {
            // wenn isDead() zurückgegeben aus movableObj
            this.playAnimation(this.imgPath.dead, 0); // dead-animation
        } else {
            this.playAnimation(this.imgPath.walk, 0); //walk animation
        }
    };
}
