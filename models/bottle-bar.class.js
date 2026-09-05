import { ImageHub } from "../scripts/img-hub.class.js";
import { StatusCounter } from "./status-counter.class.js";

export class BottleBar extends StatusCounter {
    imgPath = ImageHub.STATUSBAR.iconBottle;

    constructor() {
        super();
        this.loadImage(this.imgPath);
        this.x = 125;
    }
}
