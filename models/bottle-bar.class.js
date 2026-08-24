import { ImageHub } from "./img-hub.class.js";
import { StatusBar } from "./statusbar.class.js";

export class BottleBar extends StatusBar {
    imgPath = ImageHub.STATUSBAR.bottle;

    constructor() {
        super();
        this.loadImages(this.imgPath);
        this.y = 0;
        this.setPercentage(0, this.imgPath);
    }
}
