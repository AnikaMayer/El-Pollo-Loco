import { ImageHub } from "../scripts/img-hub.class.js";
import { IntervalHub } from "../scripts/intervall-hub.class.js";
import { MovableObject } from "./movable-object.class.js";

export class Cloud extends MovableObject {
    width = 500;
    height = 250;
    imgPath = ImageHub.BACKGROUND.clouds;

    constructor() {
        super().loadImage(this.imgPath[0]);

        this.x = Math.random() * 3500; //zufällig generierte Zahl zwischen 0 und 2500
        this.y = 20 + Math.random() * 20;
        IntervalHub.startInterval(this.moveClouds, 1000 / 60);
    }

    moveClouds = () => {
        this.moveLeft();
    };
}
