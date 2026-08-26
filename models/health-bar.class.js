import { ImageHub } from "./img-hub.class.js";
import { StatusBar } from "./statusbar.class.js";

export class HealthBar extends StatusBar {
    imgPath = ImageHub.STATUSBAR.health;

    constructor() {
        super();
        this.loadImages(this.imgPath);
        this.setPercentage(100, this.imgPath);
    }
}
