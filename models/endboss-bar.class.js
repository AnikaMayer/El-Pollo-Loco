import { ImageHub } from "./img-hub.class.js";
import { StatusBar } from "./statusbar.class.js";

export class EndbossBar extends StatusBar {
    imgPath = ImageHub.STATUSBAR.endboss;

    constructor() {
        super();
        this.loadImages(this.imgPath);
        this.x = 460;
        this.setPercentage(100, this.imgPath);
    }
}
