import { level1 } from "../levels/level1.js";
import { Character } from "./character.class.js";
import { StatusBar } from "./status-bar.class.js";

export class World {
    character = new Character();
    level = level1;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    statusbar = new StatusBar();

    constructor(_canvas, _keyboard) {
        this.ctx = _canvas.getContext("2d");
        this.canvas = _canvas;
        this.keyboard = _keyboard;
        this.draw();
        this.setWorld();
        this.checkCollisions();
    }

    setWorld() {
        this.character.world = this;
    }

    checkCollisions() {
        setInterval(() => {
            this.level.enemies.forEach((enemy) => {
                if (this.character.isColliding(enemy)) {
                    this.character.hit();
                    this.statusbar.setPercentage(this.character.energy);
                }
            });
        }, 200);
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); //am Anfang wird canvas immer geleert
        this.ctx.translate(this.camera_x, 0); //Map wird nach links verschoben
        this.addObjectsToMap(this.level.backgroundObjects); //Objekte werden eingefügt bzw. "gezeichnet"

        this.ctx.translate(-this.camera_x, 0); // Kameraperspektive zurücksetzen
        // ------ Space for fixed objects ------
        this.addToMap(this.statusbar);
        this.ctx.translate(this.camera_x, 0); // Kameraperspektive wieder positionieren

        this.addToMap(this.character);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.enemies);
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
            this.flipImage(mO);
        }
        mO.draw(this.ctx);
        mO.drawFrame(this.ctx);
        if (mO.otherDirection) {
            this.flipImageBack(mO);
        }
    }

    flipImage(mO) {
        this.ctx.save();
        this.ctx.translate(mO.width, 0);
        this.ctx.scale(-1, 1);
        mO.x = mO.x * -1;
    }

    flipImageBack(mO) {
        mO.x = mO.x * -1;
        this.ctx.restore();
    }
}
