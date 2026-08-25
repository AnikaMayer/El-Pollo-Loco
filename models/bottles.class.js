import { CollectableObject } from "./collectable-object.class.js";
import { ImageHub } from "./img-hub.class.js";

export class Bottle extends CollectableObject {
    x;
    y = 380;
    width = 60;
    height = 50;
    imgPath = ImageHub.BOTTLE.onGround;
    showFrame = true;
    offset = {
        top: 10,
        right: 10,
        bottom: 5,
        left: 25,
    };

    constructor(_x) {
        super().loadImage(this.imgPath[0]);
        this.loadImages(this.imgPath);
        this.x = _x;
        this.getRealFrame();
    }
}
