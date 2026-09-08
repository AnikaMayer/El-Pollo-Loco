import { ImageHub } from "../../scripts/img-hub.class.js";
import { MovableObject } from "../movable-object.class.js";

/**
 * Represents a bottle collectible lying on the ground.
 * Displays a randomly chosen ground image on creation.
 * @extends MovableObject
 */
export class Bottle extends MovableObject {
    /** @type {number} The x-position of the bottle in pixels. */
    x;
    /** @type {number} The y-position of the bottle in pixels. */
    y = 380;
    /** @type {number} The width of the bottle in pixels. */
    width = 60;
    /** @type {number} The height of the bottle in pixels. */
    height = 50;
    /** @type {Object} The image paths for all bottle sprites, loaded from the ImageHub. */
    imgPath = ImageHub.BOTTLE;
    /** @type {string[]} The image paths for the on-ground bottle sprites. */
    groundImages = this.imgPath.onGround;
    /** @type {number} A random index used to select the initial ground image. */
    randomIndex = Math.floor(Math.random() * this.groundImages.length);
    /**
     * Hitbox offsets in pixels to fine-tune collision detection.
     * @type {{ top: number, right: number, bottom: number, left: number }}
     */
    offset = {
        top: 10,
        right: 10,
        bottom: 5,
        left: 25,
    };

    /**
     * Creates a new Bottle at the given x-position with a randomly chosen ground image.
     * @param {number} _x - The x-position where the bottle is placed.
     */
    constructor(_x) {
        super().loadImage(this.groundImages[this.randomIndex]);
        this.loadImages(this.groundImages);
        this.x = _x;
        this.getRealFrame();
    }
}
