import { ImageHub } from "./img-hub.class.js";
import { IntervalHub } from "./intervall-hub.class.js";
import { MovableObject } from "./movable-object.class.js";

export class ThrowableObject extends MovableObject {
    imgPath = ImageHub.BOTTLE;
    keepFalling = true;
    showFrame = true;
    offset = {
        top: 10,
        right: 15,
        bottom: 10,
        left: 15,
    };

    constructor(x, y) {
        super().loadImage(this.imgPath.rotation[0]);
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 60;
        this.throw();
    }

    throw() {
        this.speedY = 30;
        IntervalHub.startInterval(this.applyGravity, 1000 / 25);
        IntervalHub.startInterval(this.flyingBottle, 1000 / 40);
        this.getRealFrame();
    }

    flyingBottle = () => {
        this.x += 10;
    };
}
