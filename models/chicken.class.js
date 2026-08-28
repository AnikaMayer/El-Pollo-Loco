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
    showFrame = true;
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

        this.x = 200 + Math.random() * 500;
        this.speed = 0.15 + Math.random() * 0.5;
        IntervalHub.startInterval(this.moveChicken, 1000 / 60);
        IntervalHub.startInterval(this.animateChicken, 1000 / 5);
        // IntervalHub.startInterval(this.chickenSound, 1000 / 60);
        this.getRealFrame();
    }

    moveChicken = () => {
        // this.moveLeft();
    };

    // Sounds gemanaged über toggle-methode in MovableObj -> dafür Path übergeben mit Bedingung
    chickenSound = () => {
        const audio = this.audioPath;
        this.playSound(audio, this.isDead());
    };

    animateChicken = () => {
        if (this.isDead()) {
            // wenn isDead() zurückgegeben aus movableObj
            this.playAnimation(this.imgPath.dead); // dead-animation
        } else {
            this.playAnimation(this.imgPath.walk); //walk animation
        }
    };
}
