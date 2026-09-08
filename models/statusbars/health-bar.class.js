import { ImageHub } from "../../scripts/img-hub.class.js";
import { StatusBar } from "./statusbar.class.js";

/**
 * Displays the player's health bar in the HUD.
 * Initialized at 100% health using the default position from StatusBar.
 * @extends StatusBar
 */
export class HealthBar extends StatusBar {
    /** @type {string[]} The image paths for the health bar sprites, loaded from the ImageHub. */
    imgPath = ImageHub.STATUSBAR.health;

    /**
     * Creates a new HealthBar and initializes it at 100% health.
     */
    constructor() {
        super();
        this.loadImages(this.imgPath);
        this.setPercentage(100, this.imgPath);
    }
}
