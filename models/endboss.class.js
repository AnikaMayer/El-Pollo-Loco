import { ImageHub } from "../scripts/img-hub.class.js";
import { IntervalHub } from "../scripts/intervall-hub.class.js";
import { MovableObject } from "./movable-object.class.js";

export class Endboss extends MovableObject {
    y = 55;
    width = 250;
    height = 400;
    energy = 300;
    imgPath = ImageHub.BOSS;

    constructor() {
        super().loadImage(this.imgPath.alert[0]);
        this.loadImages(this.imgPath.alert);
        this.loadImages(this.imgPath.dead);
        this.loadImages(this.imgPath.hurt);
        this.x = 2500;
        IntervalHub.startInterval(this.animate, 1000 / 5);
    }

    animate = () => {
        if (this.isDead()) {
            // wenn isDead() zurückgegeben aus movableObj
            this.playAnimation(this.imgPath.dead);
        } else if (this.isHurt()) {
            this.playAnimation(this.imgPath.hurt);
        } else {
            //alert animation
            this.playAnimation(this.imgPath.alert);
        }
    };
}
