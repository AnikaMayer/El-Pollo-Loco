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
        this.getSpaceBetween(this.bottle, this.level_end_x);
    }

    getSpaceBetween(objArray, canvasWidth) {
        let numberOfObjects = objArray.length;
        let objectWidth = objArray[0].width;
        let gap =
            (canvasWidth - objectWidth * numberOfObjects) /
            (numberOfObjects + 1);
        let x = gap;
        objArray.forEach((object) => {
            object.x = x;
            x += gap + objectWidth;
        });
        return objArray;
    }
}
