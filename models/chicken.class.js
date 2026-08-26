import { ImageHub } from "./img-hub.class.js";
import { IntervalHub } from "./intervall-hub.class.js";
import { MovableObject } from "./movable-object.class.js";

export class Chicken extends MovableObject {
    y = 360;
    width = 80;
    height = 60;
    imgPath = ImageHub.CHICKEN;
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
        this.getRealFrame();
    }

    moveChicken = () => {
        // this.moveLeft();
    };

    animateChicken = () => {
        if (this.isDead()) {
            this.playAnimation(this.imgPath.dead); // dead-animation
        } else {
            this.playAnimation(this.imgPath.walk); //walk animation
        }
    };
}
