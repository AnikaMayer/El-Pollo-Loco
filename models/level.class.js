export class Level {
    enemies;
    clouds;
    bottles;
    coins;
    backgroundObjects;
    level_end_x = 3500;

    constructor(_enemies, _clouds, _bottles, _coins, _backgroundObjects) {
        this.enemies = _enemies;
        this.clouds = _clouds;
        this.bottles = _bottles;
        this.coins = _coins;
        this.backgroundObjects = _backgroundObjects;
    }
}
