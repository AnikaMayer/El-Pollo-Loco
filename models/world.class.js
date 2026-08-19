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
    keyboard;
    camera_x = 0;

    constructor(_canvas, _keyboard) {
        this.ctx = _canvas.getContext("2d");
        this.canvas = _canvas;
        this.keyboard = _keyboard;
        this.draw();
        this.setWorld();
    }

    setWorld() {
        this.character.world = this;
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); //am Anfang wird canvas immer geleert
        this.ctx.translate(this.camera_x, 0); //Map wird nach links verschoben
        this.addObjectsToMap(this.backgroundObjects); //Objekte werden eingefügt bzw. "gezeichnet"
        this.addToMap(this.character);
        this.addObjectsToMap(this.clouds);
        this.addObjectsToMap(this.enemies);
        this.ctx.translate(-this.camera_x, 0); //Map wird wieder nach rechts verschoben

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

    //mO = movable Object -> Objekt wird mit entsprechender Höhe, Weite u. Koordinaten gezeichnet
    addToMap(mO) {
        if (mO.otherDirection) {
            this.ctx.save();
            this.ctx.translate(mO.width, 0);
            this.ctx.scale(-1, 1);
            mO.x = mO.x * -1;
        }
        this.ctx.drawImage(mO.img, mO.x, mO.y, mO.width, mO.height);
        if (mO.otherDirection) {
            mO.x = mO.x * -1;
            this.ctx.restore();
        }
    }
}
