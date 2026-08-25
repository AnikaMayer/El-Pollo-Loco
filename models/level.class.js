export class Level {
    enemies;
    clouds;
    bottle;
    coin;
    backgroundObjects;
    level_end_x = 2200;

    constructor(_enemies, _clouds, _bottle, _coin, _backgroundObjects) {
        this.enemies = _enemies;
        this.clouds = _clouds;
        this.bottle = _bottle;
        this.coin = _coin;
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
