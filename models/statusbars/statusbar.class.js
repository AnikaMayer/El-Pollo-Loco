import { DrawableObject } from "../drawable-object.class.js";
import { ImageHub } from "../../scripts/img-hub.class.js";

/**
 * Base class for all status bars in the HUD (e.g. health, endboss).
 * Displays a sprite that updates based on a percentage value.
 * @extends DrawableObject
 */
export class StatusBar extends DrawableObject {
    /** @type {Object} The image paths for all status bar sprites, loaded from the ImageHub. */
    imgPath = ImageHub.STATUSBAR;
    /** @type {number} The current percentage value (0–100) represented by the status bar. */
    percentage = 100;

    /**
     * Creates a new StatusBar with default position and size.
     */
    constructor() {
        super();
        this.x = 5;
        this.y = 40;
        this.width = 200;
        this.height = 60;
    }

    /**
     * Updates the status bar to reflect a new percentage value.
     * Selects the appropriate sprite from the given image path array.
     * @param {number} _percentage - The new percentage value (0–100).
     * @param {string[]} _statPath - The array of image paths for this status bar.
     */
    setPercentage(_percentage, _statPath) {
        this.percentage = _percentage;
        let path = _statPath[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    /**
     * Resolves the sprite index (0–5) based on the current percentage.
     * @returns {number} The index of the sprite to display.
     */
    resolveImageIndex() {
        if (this.percentage === 100) {
            return 5;
        } else if (this.percentage >= 80) {
            return 4;
        } else if (this.percentage >= 60) {
            return 3;
        } else if (this.percentage >= 40) {
            return 2;
        } else if (this.percentage >= 20) {
            return 1;
        } else {
            return 0;
        }
    }
}
