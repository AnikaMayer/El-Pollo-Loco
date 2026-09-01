import { BackgroundObject } from "../models/background-object.class.js";
import { Bottle } from "../models/bottles.class.js";
import { Chicken } from "../models/chicken.class.js";
import { Cloud } from "../models/clouds.class.js";
import { Coin } from "../models/coins.class.js";
import { Endboss } from "../models/endboss.class.js";
import { ImageHub } from "../scripts/img-hub.class.js";
import { Level } from "../models/level.class.js";
import { BabyChicken } from "../models/baby-chicken.class.js";

export const level1 = new Level(
    [
        new Chicken(),
        new Chicken(),
        new Chicken(),
        new BabyChicken(),
        new BabyChicken(),
        new BabyChicken(),
        new BabyChicken(),
        new BabyChicken(),
        new Endboss(),
    ],
    [new Cloud(), new Cloud(), new Cloud(), new Cloud()],
    [
        new Bottle(600),
        new Bottle(850),
        new Bottle(1200),
        new Bottle(1600),
        new Bottle(1900),
    ],
    [
        ...Coin.arcPattern(510, 275),
        ...Coin.horizontalLinePattern(1200, 250),
        ...Coin.verticalLinePattern(1700, 250),
        ...Coin.diagonalPattern(1900, 250),
    ],
    [
        new BackgroundObject(ImageHub.BACKGROUND.air),
        new BackgroundObject(ImageHub.BACKGROUND.thirdLayer[1]),
        new BackgroundObject(ImageHub.BACKGROUND.secondLayer[1]),
        new BackgroundObject(ImageHub.BACKGROUND.firstLayer[1]),

        new BackgroundObject(ImageHub.BACKGROUND.air),
        new BackgroundObject(ImageHub.BACKGROUND.thirdLayer[0]),
        new BackgroundObject(ImageHub.BACKGROUND.secondLayer[0]),
        new BackgroundObject(ImageHub.BACKGROUND.firstLayer[0]),
        new BackgroundObject(ImageHub.BACKGROUND.air),
        new BackgroundObject(ImageHub.BACKGROUND.thirdLayer[1]),
        new BackgroundObject(ImageHub.BACKGROUND.secondLayer[1]),
        new BackgroundObject(ImageHub.BACKGROUND.firstLayer[1]),

        new BackgroundObject(ImageHub.BACKGROUND.air),
        new BackgroundObject(ImageHub.BACKGROUND.thirdLayer[0]),
        new BackgroundObject(ImageHub.BACKGROUND.secondLayer[0]),
        new BackgroundObject(ImageHub.BACKGROUND.firstLayer[0]),
        new BackgroundObject(ImageHub.BACKGROUND.air),
        new BackgroundObject(ImageHub.BACKGROUND.thirdLayer[1]),
        new BackgroundObject(ImageHub.BACKGROUND.secondLayer[1]),
        new BackgroundObject(ImageHub.BACKGROUND.firstLayer[1]),

        new BackgroundObject(ImageHub.BACKGROUND.air),
        new BackgroundObject(ImageHub.BACKGROUND.thirdLayer[0]),
        new BackgroundObject(ImageHub.BACKGROUND.secondLayer[0]),
        new BackgroundObject(ImageHub.BACKGROUND.firstLayer[0]),
        new BackgroundObject(ImageHub.BACKGROUND.air),
        new BackgroundObject(ImageHub.BACKGROUND.thirdLayer[1]),
        new BackgroundObject(ImageHub.BACKGROUND.secondLayer[1]),
        new BackgroundObject(ImageHub.BACKGROUND.firstLayer[1]),
    ],
);
