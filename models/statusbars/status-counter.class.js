import { DrawableObject } from "../drawable-object.class.js";
import { ImageHub } from "../../scripts/img-hub.class.js";

/**
 * Base class for HUD counters that display a numeric count with an icon (e.g. bottles, coins).
 * @extends DrawableObject
 */
export class StatusCounter extends DrawableObject {
    /** @type {Object} The image paths for status bar icons, loaded from the ImageHub. */
    imgPath = ImageHub.STATUSBAR;
    /** @type {number} The current count to display. */
    count = 0;

    /**
     * Creates a new StatusCounter with default size and y-position.
     */
    constructor() {
        super();
        this.width = 60;
        this.height = 60;
        this.y = 90;
    }

    /**
     * Updates the displayed count to a new value.
     * @param {number} newCount - The new count to display.
     */
    setCount(newCount) {
        this.count = newCount;
    }

    /**
     * Draws the current count as text next to the icon on the canvas.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     */
    drawCount(ctx) {
        ctx.font = "28px Alfa Slab One";
        ctx.fillStyle = "white";
        ctx.fillText(
            this.count,
            this.x + this.width,
            this.y + this.height * 0.7,
        );
    }
}
