export class Level {
    enemies;
    clouds;
    backgroundObjects;
    collectableObjects;
    level_end_x = 2200;

    constructor(_enemies, _clouds, _backgroundObjects, _collObjects) {
        this.enemies = _enemies;
        this.clouds = _clouds;
        this.backgroundObjects = _backgroundObjects;
        this.collectableObjects = _collObjects;
    }
}
