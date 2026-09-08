import { ImageHub } from "../scripts/img-hub.class.js";
import { DrawableObject } from "./drawable-object.class.js";

/**
 * Represents the end screen overlay displayed when the game is won or lost.
 * Switches between a win and lose image based on the current state.
 * @extends DrawableObject
 */
export class Endscreen extends DrawableObject {
    /** @type {number} The x-position of the end screen in pixels. */
    x = 160;
    /** @type {number} The y-position of the end screen in pixels. */
    y = 100;
    /** @type {number} The width of the end screen in pixels. */
    width = 400;
    /** @type {number} The height of the end screen in pixels. */
    height = 240;
    /** @type {Object} The image paths for the win and lose screens, loaded from the ImageHub. */
    imgPath = ImageHub.ENDSCREEN;
    /**
     * The current state of the end screen.
     * @type {'win' | 'lose'}
     */
    state = "win";

    /**
     * Creates a new Endscreen and preloads both the win and lose images.
     */
    constructor() {
        super().loadImage(this.imgPath.win);
        this.loadImage(this.imgPath.lose);
    }

    /**
     * Sets the end screen state and updates the displayed image accordingly.
     * @param {'win' | 'lose'} value - The new state to display.
     */
    setState(value) {
        this.state = value;
        if (value === "win") {
            this.loadImage(this.imgPath.win);
        } else if (value === "lose") {
            this.loadImage(this.imgPath.lose);
        }
    }
}
