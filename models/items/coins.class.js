import { ImageHub } from "../../scripts/img-hub.class.js";
import { IntervalHub } from "../../scripts/intervall-hub.class.js";
import { MovableObject } from "../movable-object.class.js";

/**
 * Represents a coin collectible in the game world.
 * Coins animate continuously and can be arranged in predefined patterns.
 * @extends MovableObject
 */
export class Coin extends MovableObject {
    /** @type {number} The x-position of the coin in pixels. */
    x;
    /** @type {number} The y-position of the coin in pixels. */
    y;
    /** @type {number} The width of the coin in pixels. */
    width = 140;
    /** @type {number} The height of the coin in pixels. */
    height = 140;
    /** @type {string[]} The image paths for the coin animation, loaded from the ImageHub. */
    imgPath = ImageHub.COIN;
    /**
     * Hitbox offsets in pixels to fine-tune collision detection.
     * @type {{ top: number, right: number, bottom: number, left: number }}
     */
    offset = {
        top: 50,
        right: 50,
        bottom: 50,
        left: 50,
    };

    /**
     * Creates a new Coin at the given position and starts its animation interval.
     * @param {number} _x - The x-position of the coin.
     * @param {number} _y - The y-position of the coin.
     */
    constructor(_x, _y) {
        super().loadImage(this.imgPath[0]);
        this.loadImages(this.imgPath);
        IntervalHub.startInterval(this.animateCoin, 1000 / 2.5);
        this.x = _x;
        this.y = _y;
        this.getRealFrame();
    }

    /**
     * Plays the coin's spinning animation on each interval tick.
     * @type {Function}
     */
    animateCoin = () => {
        this.playAnimation(this.imgPath, 0);
    };

    /**
     * Creates an arc-shaped pattern of 5 coins.
     * @param {number} baseX - The x-position of the leftmost coin.
     * @param {number} baseY - The y-position of the leftmost coin.
     * @returns {Coin[]} An array of 5 coins arranged in an arc.
     */
    static arcPattern(baseX, baseY) {
        const coins = [];
        const coin1 = new Coin(baseX, baseY);
        const coin2 = new Coin(baseX + 60, baseY - 50);
        const coin3 = new Coin(baseX + 130, baseY - 90);
        const coin4 = new Coin(baseX + 200, baseY - 50);
        const coin5 = new Coin(baseX + 260, baseY);
        coins.push(coin1, coin2, coin3, coin4, coin5);
        return coins;
    }

    /**
     * Creates a horizontal line pattern of 5 coins spaced 50px apart.
     * @param {number} baseX - The x-position of the leftmost coin.
     * @param {number} y - The y-position of all coins.
     * @returns {Coin[]} An array of 5 coins arranged in a horizontal line.
     */
    static horizontalLinePattern(baseX, y) {
        const coins = [];
        const coin1 = new Coin(baseX, y);
        const coin2 = new Coin(baseX + 50, y);
        const coin3 = new Coin(baseX + 100, y);
        const coin4 = new Coin(baseX + 150, y);
        const coin5 = new Coin(baseX + 200, y);
        coins.push(coin1, coin2, coin3, coin4, coin5);
        return coins;
    }

    /**
     * Creates a short horizontal line pattern of 3 coins spaced 50px apart.
     * @param {number} baseX - The x-position of the leftmost coin.
     * @param {number} y - The y-position of all coins.
     * @returns {Coin[]} An array of 3 coins arranged in a short horizontal line.
     */
    static shortHorizontalLinePattern(baseX, y) {
        const coins = [];
        const coin1 = new Coin(baseX, y);
        const coin2 = new Coin(baseX + 50, y);
        const coin3 = new Coin(baseX + 100, y);
        coins.push(coin1, coin2, coin3);
        return coins;
    }

    /**
     * Creates a vertical line pattern of 3 coins spaced 50px apart.
     * @param {number} x - The x-position of all coins.
     * @param {number} baseY - The y-position of the bottommost coin.
     * @returns {Coin[]} An array of 3 coins arranged in a vertical line.
     */
    static verticalLinePattern(x, baseY) {
        const coins = [];
        const coin1 = new Coin(x, baseY);
        const coin2 = new Coin(x, baseY - 50);
        const coin3 = new Coin(x, baseY - 100);
        coins.push(coin1, coin2, coin3);
        return coins;
    }

    /**
     * Creates a short vertical line pattern of 2 coins spaced 50px apart.
     * @param {number} x - The x-position of all coins.
     * @param {number} baseY - The y-position of the bottommost coin.
     * @returns {Coin[]} An array of 2 coins arranged in a short vertical line.
     */
    static shortVerticalLinePattern(x, baseY) {
        const coins = [];
        const coin1 = new Coin(x, baseY);
        const coin2 = new Coin(x, baseY - 50);
        coins.push(coin1, coin2);
        return coins;
    }

    /**
     * Creates a diagonal pattern of 5 coins going up to the right, spaced 50px apart.
     * @param {number} baseX - The x-position of the bottommost coin.
     * @param {number} baseY - The y-position of the bottommost coin.
     * @returns {Coin[]} An array of 5 coins arranged diagonally.
     */
    static diagonalPattern(baseX, baseY) {
        const coins = [];
        const coin1 = new Coin(baseX, baseY);
        const coin2 = new Coin(baseX + 50, baseY - 25);
        const coin3 = new Coin(baseX + 100, baseY - 50);
        const coin4 = new Coin(baseX + 150, baseY - 75);
        const coin5 = new Coin(baseX + 200, baseY - 100);
        coins.push(coin1, coin2, coin3, coin4, coin5);
        return coins;
    }
}
