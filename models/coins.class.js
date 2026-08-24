import { CollectableObject } from "./collectable-object.class.js";
import { ImageHub } from "./img-hub.class.js";
import { IntervalHub } from "./intervall-hub.class.js";

export class Coin extends CollectableObject {
    x = 300;
    y = 300;
    width = 140;
    height = 140;
    imgPath = ImageHub.COIN;
    showFrame = true;
    offset = {
        top: 50,
        right: 50,
        bottom: 50,
        left: 50,
    };

    constructor() {
        super().loadImage(this.imgPath[0]);
        this.loadImages(this.imgPath);
        IntervalHub.startInterval(this.animateCoin, 400);
        this.x = 200 + Math.random() * 500;
        // this.y = 300 + Math.random() * -50;
        this.getRealFrame();
    }

    animateCoin = () => {
        this.playAnimation(this.imgPath);
    };

    placeCoins() {}

    coinPatterns() {
        return ((this.x = 400), (this.y = 280));
    }
}
