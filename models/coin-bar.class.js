import { ImageHub } from "./img-hub.class.js";
import { StatusBar } from "./statusbar.class.js";

export class CoinBar extends StatusBar {
    imgPath = ImageHub.STATUSBAR.coin;

    constructor() {
        super();
        this.loadImages(this.imgPath);
        this.x = 250;
        this.setPercentage(100, this.imgPath);
    }
}
