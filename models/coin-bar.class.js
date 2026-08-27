import { ImageHub } from "../scripts/img-hub.class.js";
import { StatusCounter } from "./status-counter.class.js";

export class CoinBar extends StatusCounter {
    imgPath = ImageHub.STATUSBAR.iconCoin;

    constructor() {
        super();
        this.loadImage(this.imgPath);
        this.x = 35;
        this.y = 50;
    }
}
