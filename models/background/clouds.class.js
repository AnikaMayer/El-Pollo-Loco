import { ImageHub } from "../../scripts/img-hub.class.js";
import { IntervalHub } from "../../scripts/intervall-hub.class.js";
import { MovableObject } from "../movable-object.class.js";

/**
 * Represents a cloud in the game world that moves continuously to the left.
 * Clouds are placed at a random horizontal and vertical position on creation.
 * @extends MovableObject
 */
export class Cloud extends MovableObject {
    /** @type {number} The width of the cloud in pixels. */
    width = 500;
    /** @type {number} The height of the cloud in pixels. */
    height = 250;
    /** @type {string[]} The image paths for the cloud, loaded from the ImageHub. */
    imgPath = ImageHub.BACKGROUND.clouds;

    /**
     * Creates a new Cloud, places it at a random position and starts its movement interval.
     */
    constructor() {
        super().loadImage(this.imgPath[0]);

        this.x = Math.random() * 5000;
        this.y = 20 + Math.random() * 20;
        IntervalHub.startInterval(this.moveClouds, 1000 / 60);
    }

    /**
     * Moves the cloud to the left on every interval tick.
     * @type {Function}
     */
    moveClouds = () => {
        this.moveLeft();
    };
}
