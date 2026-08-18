class World {
    character = new Character();
    enemies = [new Chicken(), new Chicken(), new Chicken()];
    clouds = [new Cloud()];
    backgroundObjects = [
        new BackgroundObject(ImageHub.BACKGROUND.air, 0),
        new BackgroundObject(ImageHub.BACKGROUND.thirdLayer[0], 0),
        new BackgroundObject(ImageHub.BACKGROUND.secondLayer[0], 0),
        new BackgroundObject(ImageHub.BACKGROUND.firstLayer[0], 0),
    ];
    canvas;
    ctx;

    constructor(_canvas) {
        this.ctx = _canvas.getContext("2d");
        this.canvas = _canvas;
        this.draw();
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.addObjectsToMap(this.backgroundObjects);
        this.addToMap(this.character);
        this.addObjectsToMap(this.clouds);
        this.addObjectsToMap(this.enemies);

        // draw() wird immer wieder aufgerufen
        const self = this;
        requestAnimationFrame(function () {
            self.draw();
        });
    }

    addObjectsToMap(objects) {
        objects.forEach((_object) => {
            this.addToMap(_object);
        });
    }

    addToMap(mO) {
        this.ctx.drawImage(mO.img, mO.x, mO.y, mO.width, mO.height);
    }
}
