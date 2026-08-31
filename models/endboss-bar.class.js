import { ImageHub } from "../scripts/img-hub.class.js";
import { StatusBar } from "./statusbar.class.js";

export class EndbossBar extends StatusBar {
    imgPath = ImageHub.STATUSBAR.endboss;
    percentage = 200;

    constructor() {
        super();
        this.loadImages(this.imgPath);
        this.x = 460;
        this.y = 9;
        this.setPercentage(100, this.imgPath);
    }
}
