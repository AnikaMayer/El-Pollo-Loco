import { ImageHub } from "../../scripts/img-hub.class.js";
import { StatusCounter } from "./status-counter.class.js";

/**
 * Displays the bottle count icon in the HUD.
 * Positioned on the right side of the status bar area.
 * @extends StatusCounter
 */
export class BottleBar extends StatusCounter {
    /** @type {string} The image path for the bottle icon, loaded from the ImageHub. */
    imgPath = ImageHub.STATUSBAR.iconBottle;

    /**
     * Creates a new BottleBar and positions it at x = 95.
     */
    constructor() {
        super();
        this.loadImage(this.imgPath);
        this.x = 95;
    }
}
