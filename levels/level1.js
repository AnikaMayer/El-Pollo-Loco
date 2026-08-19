const level1 = new Level(
    [new Chicken(), new Chicken(), new Chicken(), new Endboss()],
    [new Cloud()],
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
