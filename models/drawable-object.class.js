/**
 * Base class for all drawable game objects.
 * Provides image loading, drawing and hitbox visualization.
 */
export class DrawableObject {
    /** @type {number} The x-position of the object in pixels. */
    x = 120;
    /** @type {number} The y-position of the object in pixels. */
    y = 280;
    /** @type {number} The width of the object in pixels. */
    width = 100;
    /** @type {number} The height of the object in pixels. */
    height = 150;
    /** @type {HTMLImageElement} The currently displayed image. */
    img;
    /** @type {Object.<string, HTMLImageElement>} Cache of preloaded images, keyed by path. */
    imageCache = {};
    /** @type {number} The index of the current animation frame. */
    currentImage = 0;
    /**
     * Hitbox offsets in pixels to fine-tune collision detection.
     * @type {{ top: number, right: number, bottom: number, left: number }}
     */
    offset = {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
    };

    /**
     * Loads a single image and sets it as the current image.
     * @param {string} path - The path to the image file.
     */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    /**
     * Preloads an array of images into the image cache.
     * @param {string[]} arr - An array of image paths to preload.
     */
    loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    /**
     * Draws the current image onto the canvas.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     */
    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
}
