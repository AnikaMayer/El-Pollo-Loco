import { level1 } from "../levels/level1.js";
import { Character } from "./character.class.js";
import { IntervalHub } from "./intervall-hub.class.js";
import { HealthBar } from "./health-bar.class.js";
import { ThrowableObject } from "./throwable-object.class.js";
import { BottleBar } from "./bottle-bar.class.js";
import { CoinBar } from "./coin-bar.class.js";
import { EndbossBar } from "./endboss-bar.class.js";

export class World {
    character = new Character();
    level = level1;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    healthBar = new HealthBar();
    bottleBar = new BottleBar();
    coinBar = new CoinBar();
    endbossBar = new EndbossBar();
    throwableObjects = [];
    totalCoins = this.level.coin.length;
    totalBottles = this.level.bottle.length;

    constructor(_canvas, _keyboard) {
        this.ctx = _canvas.getContext("2d");
        this.canvas = _canvas;
        this.keyboard = _keyboard;
        this.draw();
        this.setWorld();
        IntervalHub.startInterval(this.run, 1000 / 5);
        IntervalHub.startInterval(this.checkObjectCollisions, 1000 / 60);
    }

    setWorld() {
        this.character.world = this;
    }

    run = () => {
        this.checkEnemyCollisions();
        this.checkThrownObjects();
    };

    checkThrownObjects() {
        if (this.keyboard.D) {
            let bottle = new ThrowableObject(
                this.character.x + 100,
                this.character.y + 100,
            );
            this.throwableObjects.push(bottle);
        }
    }

    checkEnemyCollisions() {
        this.level.enemies.forEach((enemy) => {
            if (this.character.isColliding(enemy)) {
                this.character.hit();
                this.healthBar.setPercentage(
                    this.character.energy,
                    this.healthBar.imgPath,
                );
            }
        });
    }

    checkObjectCollisions = () => {
        this.level.coin = this.checkCollectables(
            this.level.coin,
            this.coinBar,
            this.totalCoins,
        );
        this.level.bottle = this.checkCollectables(
            this.level.bottle,
            this.bottleBar,
            this.totalBottles,
        );
    };

    checkCollectables(objects, bar, total) {
        const remainingObjects = objects.filter((object) => {
            return !this.character.isColliding(object);
        });

        if (remainingObjects.length < objects.length) {
            const collected = total - remainingObjects.length;
            const percentage = Math.round((collected / total) * 100);
            bar.setPercentage(percentage, bar.imgPath);
        }
        return remainingObjects;
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); //am Anfang wird canvas immer geleert
        this.ctx.translate(this.camera_x, 0); //Map wird nach links verschoben
        this.addObjectsToMap(this.level.backgroundObjects); //Objekte werden eingefügt bzw. "gezeichnet"
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.coin);
        this.addObjectsToMap(this.level.bottle);

        this.ctx.translate(-this.camera_x, 0); // Kameraperspektive zurücksetzen
        // ------ Space for fixed objects ------
        this.addToMap(this.healthBar);
        this.addToMap(this.bottleBar);
        this.addToMap(this.coinBar);
        this.addToMap(this.endbossBar);
        this.ctx.translate(this.camera_x, 0); // Kameraperspektive wieder positionieren

        this.addToMap(this.character);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.throwableObjects);

        this.ctx.translate(-this.camera_x, 0); //Map wird wieder nach rechts verschoben

        // draw() wird immer wieder aufgerufen
        requestAnimationFrame(() => this.draw());
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
