import { BackgroundObject } from "../models/background-object.class.js";
import { Bottle } from "../models/bottles.class.js";
import { Chicken } from "../models/chicken.class.js";
import { Cloud } from "../models/clouds.class.js";
import { Coin } from "../models/coins.class.js";
import { Endboss } from "../models/endboss.class.js";
import { ImageHub } from "../models/img-hub.class.js";
import { Level } from "../models/level.class.js";

export const level1 = new Level(
    [new Chicken(), new Chicken(), new Chicken(), new Endboss()],
    [new Cloud()],
    [
        new Bottle(600),
        new Bottle(850),
        new Bottle(1200),
        new Bottle(1600),
        new Bottle(1900),
    ],
    [
        new Coin(510, 275),
        new Coin(620, 200),
        new Coin(730, 125),
        new Coin(840, 200),
        new Coin(950, 275),

        new Coin(1200, 250),
        new Coin(1250, 250),
        new Coin(1300, 250),
        new Coin(1350, 250),
        new Coin(1400, 250),

        new Coin(1700, 250),
        new Coin(1700, 200),
        new Coin(1700, 150),

        new Coin(1900, 250),
        new Coin(1950, 225),
        new Coin(2000, 200),
        new Coin(2050, 175),
        new Coin(2100, 150),
    ],
    [
        new BackgroundObject(ImageHub.BACKGROUND.air, -720),
        new BackgroundObject(ImageHub.BACKGROUND.thirdLayer[1], -720),
        new BackgroundObject(ImageHub.BACKGROUND.secondLayer[1], -720),
        new BackgroundObject(ImageHub.BACKGROUND.firstLayer[1], -720),

        new BackgroundObject(ImageHub.BACKGROUND.air, 0),
        new BackgroundObject(ImageHub.BACKGROUND.thirdLayer[0], 0),
        new BackgroundObject(ImageHub.BACKGROUND.secondLayer[0], 0),
        new BackgroundObject(ImageHub.BACKGROUND.firstLayer[0], 0),
        new BackgroundObject(ImageHub.BACKGROUND.air, 720),
        new BackgroundObject(ImageHub.BACKGROUND.thirdLayer[1], 720),
        new BackgroundObject(ImageHub.BACKGROUND.secondLayer[1], 720),
        new BackgroundObject(ImageHub.BACKGROUND.firstLayer[1], 720),

        new BackgroundObject(ImageHub.BACKGROUND.air, 720 * 2),
        new BackgroundObject(ImageHub.BACKGROUND.thirdLayer[0], 720 * 2),
        new BackgroundObject(ImageHub.BACKGROUND.secondLayer[0], 720 * 2),
        new BackgroundObject(ImageHub.BACKGROUND.firstLayer[0], 720 * 2),
        new BackgroundObject(ImageHub.BACKGROUND.air, 720 * 3),
        new BackgroundObject(ImageHub.BACKGROUND.thirdLayer[1], 720 * 3),
        new BackgroundObject(ImageHub.BACKGROUND.secondLayer[1], 720 * 3),
        new BackgroundObject(ImageHub.BACKGROUND.firstLayer[1], 720 * 3),
    ],
);
