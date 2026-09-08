import { ImageHub } from "../../scripts/img-hub.class.js";
import { StatusCounter } from "./status-counter.class.js";

/**
 * Displays the coin count icon in the HUD.
 * Positioned on the left side of the status bar area.
 * @extends StatusCounter
 */
export class CoinBar extends StatusCounter {
    /** @type {string} The image path for the coin icon, loaded from the ImageHub. */
    imgPath = ImageHub.STATUSBAR.iconCoin;

    /**
     * Creates a new CoinBar and positions it at x = 5.
     */
    constructor() {
        super();
        this.loadImage(this.imgPath);
        this.x = 5;
    }
}
