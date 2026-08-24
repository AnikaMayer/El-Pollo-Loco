export class Level {
    enemies;
    clouds;
    coin;
    backgroundObjects;
    level_end_x = 2200;

    constructor(_enemies, _clouds, _coin, _backgroundObjects) {
        this.enemies = _enemies;
        this.clouds = _clouds;
        this.coin = _coin;
        this.backgroundObjects = _backgroundObjects;
    }
}
