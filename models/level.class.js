export class Level {
    enemies;
    clouds;
    bottles;
    coins;
    backgroundObjects;
    level_end_x = 2200;

    constructor(_enemies, _clouds, _bottles, _coins, _backgroundObjects) {
        this.enemies = _enemies;
        this.clouds = _clouds;
        this.bottles = _bottles;
        this.coins = _coins;
        this.backgroundObjects = _backgroundObjects;
        // this.placeBottles();
        // this.placeClouds();
    }

    // Flaschen sollen mit einem gewissen Abstand platziert werden, muss noch überarbeitet werden
    placeBottles() {
        const numberOfBottles = this.bottles.length;
        const canvasWidth = this.level_end_x;
        const bottleWidth = this.bottles[0].width;
        const gap =
            (canvasWidth - bottleWidth * numberOfBottles) /
            (numberOfBottles + 1);
        const x = gap;
        this.bottles.forEach((object) => {
            object.x = x;
            x += gap + bottleWidth;
        });
        return this.bottles;
    }

    placeClouds() {
        let numberOfClouds = this.clouds.length;
        let canvasWidth = this.level_end_x;
        let cloudWidth = this.clouds[0].width;
        let gap =
            (canvasWidth - cloudWidth * numberOfClouds) / (numberOfClouds + 1);
        let x = gap;
        this.clouds.forEach((object) => {
            object.x = x;
            x += gap + cloudWidth;
        });
        return this.clouds;
    }
}
