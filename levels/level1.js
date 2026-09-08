import { BackgroundObject } from "../models/background/background-object.class.js";
import { Bottle } from "../models/items/bottles.class.js";
import { Chicken } from "../models/enemies/chicken.class.js";
import { Cloud } from "../models/background/clouds.class.js";
import { Coin } from "../models/items/coins.class.js";
import { Endboss } from "../models/enemies/endboss.class.js";
import { ImageHub } from "../scripts/img-hub.class.js";
import { Level } from "../models/level.class.js";
import { BabyChicken } from "../models/enemies/baby-chicken.class.js";

/**
 * The current instance of Level 1. Populated by {@link initLevel}.
 * @type {Level}
 */
export let level1;
/** @type {Cloud[]} */
let clouds = [];
/** @type {Array<Chicken|BabyChicken|Endboss>} */
let enemies = [];
/** @type {BackgroundObject[]} */
const backgroundObjects = [];

/** Populates {@link backgroundObjects} once when the module is loaded. */
getBackground();

/**
 * Initializes Level 1 and resets all game objects.
 * Creates a new {@link Level} instance with enemies, clouds, bottles, coins and background objects.
 * @returns {void}
 */
export function initLevel() {
    clouds = [];
    enemies = [];
    getClouds();
    getEnemies();
    level1 = new Level(
        enemies,
        clouds,
        [
            new Bottle(600),
            new Bottle(850),
            new Bottle(1000),
            new Bottle(1200),
            new Bottle(1600),
            new Bottle(1900),
            new Bottle(2200),
            new Bottle(2450),
            new Bottle(2670),
            new Bottle(2890),
            new Bottle(3000),
            new Bottle(3400),
            new Bottle(3700),
            new Bottle(4200),
            new Bottle(4500),
        ],
        [
            ...Coin.shortVerticalLinePattern(300, 250),
            ...Coin.arcPattern(510, 275),
            ...Coin.horizontalLinePattern(1200, 250),
            ...Coin.verticalLinePattern(1600, 250),
            ...Coin.diagonalPattern(1900, 250),
            ...Coin.horizontalLinePattern(2400, 250),
            ...Coin.shortHorizontalLinePattern(2900, 200),
            ...Coin.shortVerticalLinePattern(3300, 250),
            ...Coin.arcPattern(3700, 275),
            ...Coin.diagonalPattern(4300, 250),
        ],
        backgroundObjects,
    );
}

/**
 * Fills {@link backgroundObjects} with four alternating parallax layers per segment.
 * Called once on module load.
 * @returns {void}
 */
function getBackground() {
    for (let i = 0; i < 9; i++) {
        const layerIndex = 1 - (i % 2);
        backgroundObjects.push(new BackgroundObject(ImageHub.BACKGROUND.air));
        backgroundObjects.push(
            new BackgroundObject(ImageHub.BACKGROUND.thirdLayer[layerIndex]),
        );
        backgroundObjects.push(
            new BackgroundObject(ImageHub.BACKGROUND.secondLayer[layerIndex]),
        );
        backgroundObjects.push(
            new BackgroundObject(ImageHub.BACKGROUND.firstLayer[layerIndex]),
        );
    }
}

/**
 * Creates 8 cloud objects and adds them to {@link clouds}.
 * @returns {void}
 */
function getClouds() {
    for (let i = 0; i < 8; i++) {
        clouds.push(new Cloud());
    }
}

/**
 * Fills {@link enemies} with 6 {@link BabyChicken}, 7 {@link Chicken} and 1 {@link Endboss}.
 * @returns {void}
 */
function getEnemies() {
    getNormalEnemies(BabyChicken, 6);
    getNormalEnemies(Chicken, 7);
    enemies.push(new Endboss());
}

/**
 * Creates multiple enemies of a given type and pushes them to {@link enemies}.
 * @param {typeof BabyChicken | typeof Chicken} enemyType - The enemy constructor.
 * @param {number} quantity - The number of enemies to create.
 * @returns {void}
 */
function getNormalEnemies(enemyType, quantity) {
    for (let i = 0; i < quantity; i++) {
        enemies.push(new enemyType());
    }
}
