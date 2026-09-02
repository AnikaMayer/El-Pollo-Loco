import { BackgroundObject } from "../models/background-object.class.js";
import { Bottle } from "../models/bottles.class.js";
import { Chicken } from "../models/chicken.class.js";
import { Cloud } from "../models/clouds.class.js";
import { Coin } from "../models/coins.class.js";
import { Endboss } from "../models/endboss.class.js";
import { ImageHub } from "../scripts/img-hub.class.js";
import { Level } from "../models/level.class.js";
import { BabyChicken } from "../models/baby-chicken.class.js";

export let level1;
const clouds = [];
const enemies = [];
const backgroundObjects = [];

getClouds();
getEnemies();
getBackground();
initLevel();

function initLevel() {
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
            new Bottle(3000),
        ],
        [
            ...Coin.shortVerticalLinePattern(300, 250),
            ...Coin.arcPattern(510, 275),
            ...Coin.horizontalLinePattern(1200, 250),
            ...Coin.verticalLinePattern(1600, 250),
            ...Coin.diagonalPattern(1900, 250),
            ...Coin.horizontalLinePattern(2400, 250),
            ...Coin.diagonalPattern(2900, 250),
        ],
        backgroundObjects,
    );
}

function getBackground() {
    for (let i = 0; i < 7; i++) {
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

function getClouds() {
    for (let i = 0; i < 6; i++) {
        clouds.push(new Cloud());
    }
}

function getEnemies() {
    getNormalEnemies(BabyChicken, 6);
    getNormalEnemies(Chicken, 7);
    enemies.push(new Endboss());
}

function getNormalEnemies(enemyType, quantity) {
    for (let i = 0; i < quantity; i++) {
        enemies.push(new enemyType());
    }
}
