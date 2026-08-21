import { ImageHub } from "./img-hub.class.js";
import { StatusBar } from "./statusbar.class.js";

export class CoinBar extends StatusBar {
    imgPath = ImageHub.STATUSBAR.coin;

    constructor() {
        super();
        this.loadImages(this.imgPath);
        this.y = 45;
        this.setPercentage(100, this.imgPath);
    }
}
