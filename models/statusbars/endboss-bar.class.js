import { ImageHub } from "../../scripts/img-hub.class.js";
import { StatusBar } from "./statusbar.class.js";

/**
 * Displays the endboss health bar in the HUD.
 * Positioned in the upper right area of the screen and initialized at 100%.
 * @extends StatusBar
 */
export class EndbossBar extends StatusBar {
    /** @type {string[]} The image paths for the endboss health bar sprites, loaded from the ImageHub. */
    imgPath = ImageHub.STATUSBAR.endboss;

    /**
     * Creates a new EndbossBar, positions it at x = 500, y = 49
     * and initializes it at 100% health.
     */
    constructor() {
        super();
        this.loadImages(this.imgPath);
        this.x = 500;
        this.y = 49;
        this.setPercentage(100, this.imgPath);
    }
}
