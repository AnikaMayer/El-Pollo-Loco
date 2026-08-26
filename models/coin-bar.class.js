import { ImageHub } from "./img-hub.class.js";
import { StatusCounter } from "./status-counter.class.js";
import { StatusBar } from "./statusbar.class.js";

export class CoinBar extends StatusCounter {
    imgPath = ImageHub.STATUSBAR.iconCoin;

    constructor() {
        super();
        this.loadImage(this.imgPath);

        this.x = 35;
        this.y = 50;
    }
}
