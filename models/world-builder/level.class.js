/**
 * Represents a game level and holds all objects that populate it.
 */
export class Level {
    /** @type {MovableObject[]} The enemy objects in this level. */
    enemies;
    /** @type {Cloud[]} The cloud objects in this level. */
    clouds;
    /** @type {Bottle[]} The bottle collectibles in this level. */
    bottles;
    /** @type {Coin[]} The coin collectibles in this level. */
    coins;
    /** @type {BackgroundObject[]} The background objects in this level. */
    backgroundObjects;
    /** @type {number} The x-position at which the level ends. */
    level_end_x = 5000;

    /**
     * Creates a new Level with the given game objects.
     * @param {MovableObject[]} _enemies - The enemies to place in the level.
     * @param {Cloud[]} _clouds - The clouds to place in the level.
     * @param {Bottle[]} _bottles - The bottle collectibles to place in the level.
     * @param {Coin[]} _coins - The coin collectibles to place in the level.
     * @param {BackgroundObject[]} _backgroundObjects - The background objects to place in the level.
     */
    constructor(_enemies, _clouds, _bottles, _coins, _backgroundObjects) {
        this.enemies = _enemies;
        this.clouds = _clouds;
        this.bottles = _bottles;
        this.coins = _coins;
        this.backgroundObjects = _backgroundObjects;
    }
}
