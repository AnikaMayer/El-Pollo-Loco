import { ImageHub } from "./img-hub.class.js";
import { StatusCounter } from "./status-counter.class.js";
import { StatusBar } from "./statusbar.class.js";

export class BottleBar extends StatusCounter {
    imgPath = ImageHub.STATUSBAR.iconBottle;

    constructor() {
        super();
        this.loadImage(this.imgPath);
        this.y = 50;
        this.x = 125;
    }
}
