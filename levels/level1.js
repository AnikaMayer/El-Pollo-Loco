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
        new Bottle(300),
        new Bottle(600),
        new Bottle(850),
        new Bottle(1200),
        new Bottle(1600),
    ],
    [new Coin(), new Coin(), new Coin(), new Coin(), new Coin()],
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
