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
    }

    placeBottles() {
        const numberOfBottles = this.bottle.length;
        const canvasWidth = this.level_end_x;
        const bottleWidth = this.bottle[0].width;
        const gap =
            (canvasWidth - bottleWidth * numberOfBottles) /
            (numberOfBottles + 1);
        const x = gap;
        this.bottle.forEach((object) => {
            object.x = x;
            x += gap + bottleWidth;
        });
        return this.bottle;
    }
}
