import { ImageHub } from "./img-hub.class.js";
import { IntervalHub } from "./intervall-hub.class.js";
import { MovableObject } from "./movable-object.class.js";

export class Chicken extends MovableObject {
    y = 360;
    width = 80;
    height = 60;
    imgPath = ImageHub.CHICKEN;
    showFrame = true;

    constructor() {
        super().loadImage(this.imgPath.walk[0]);
        this.loadImages(this.imgPath.walk);

        this.x = 200 + Math.random() * 500;
        this.speed = 0.15 + Math.random() * 0.5;
        IntervalHub.startInterval(this.moveChicken, 1000 / 60);
        IntervalHub.startInterval(this.animateChicken, 200);
    }

    moveChicken = () => {
        this.moveLeft();
    };

    animateChicken = () => {
        //walk animation
        this.playAnimation(this.imgPath.walk);
    };
}
