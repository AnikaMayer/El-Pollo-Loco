import { MovableObject } from "../movable-object.class.js";

/**
 * Represents  a background object in the game world.
 * Background objects are stacked horizontally to create a scrolling background effect.
 * @extends MovableObject
 */
export class BackgroundObject extends MovableObject {
    /** @type {number} The x-position of this background object. */
    x;
    /** @type {number} The y-position of this background object. Always 0. */
    y = 0;
    /** @type {number} The width of the background object in pixels. */
    width = 720;
    /** @type {number} The height of the background object in pixels. */
    height = 480;

    /**
     * Tracks the current x-position for the next background object to be placed.
     * Resets after every 4th object.
     * @type {number}
     */
    static xPos = -719;
    /**
     * Counts how many background objects have been placed in the current cycle (0–3).
     * @type {number}
     */
    static turn = 0;

    /**
     * Creates a new BackgroundObject and positions it automatically in the scrolling background.
     * Every 4th object advances the x-position by 719px to start a new cycle.
     * @param {string} imagePath - The path to the background image.
     */
    constructor(imagePath) {
        if (BackgroundObject.turn === 4) {
            BackgroundObject.xPos += 719;
            BackgroundObject.turn = 0;
        }
        super().loadImage(imagePath);
        this.x = BackgroundObject.xPos;
        BackgroundObject.turn++;
    }
}
