import { ImageHub } from "./img-hub.class.js";
import { MovableObject } from "./movable-object.class.js";

export class Bottle extends MovableObject {
    x;
    y = 380;
    width = 60;
    height = 50;
    imgPath = ImageHub.BOTTLE;
    groundImages = this.imgPath.onGround;
    randomIndex = Math.floor(Math.random() * this.groundImages.length);
    showFrame = true;
    offset = {
        top: 10,
        right: 10,
        bottom: 5,
        left: 25,
    };

    constructor(_x) {
        super().loadImage(this.groundImages[this.randomIndex]);
        this.loadImages(this.groundImages);
        this.x = _x;
        this.getRealFrame();
    }
}
