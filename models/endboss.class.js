import { ImageHub } from "./img-hub.class.js";
import { IntervalHub } from "./intervall-hub.class.js";
import { MovableObject } from "./movable-object.class.js";

export class Endboss extends MovableObject {
    y = 55;
    width = 250;
    height = 400;
    imgPath = ImageHub.BOSS;

    constructor() {
        super().loadImage(this.imgPath.alert[0]);
        this.loadImages(this.imgPath.alert);
        this.x = 2500;
        IntervalHub.startInterval(this.animate, 1000 / 5);
    }

    animate = () => {
        //alert animation
        this.playAnimation(this.imgPath.alert);
    };
}
