import { DrawableObject } from "./drawable-object.class.js";
import { ImageHub } from "./img-hub.class.js";

export class CollectableObject extends DrawableObject {
    x = 300;
    y = 300;
    width = 150;
    height = 150;
    imgPath = ImageHub.COIN;
    showFrame = true;
    offset = {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
    };

    constructor() {
        super().loadImage(this.imgPath[0]);
        this.loadImages(this.imgPath);
        // this.x = 200 + Math.random() * 500;
    }
}
