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
    totalCoins = this.level.coins.length;
    collectedCoins = 0;
    totalBottles = this.level.bottles.length;
    availableBottles = 99;
    bottleError = false;

    constructor(_canvas, _keyboard) {
        this.ctx = _canvas.getContext("2d");
        this.canvas = _canvas;
        this.keyboard = _keyboard;
        this.draw();
        this.setWorld();
        IntervalHub.startInterval(this.run, 1000 / 5);
        IntervalHub.startInterval(this.checkBottleDamage, 1000 / 10);
        IntervalHub.startInterval(this.checkCoinCollision, 1000 / 60);
        IntervalHub.startInterval(this.checkBootleCollision, 1000 / 60);
    }

    setWorld() {
        this.character.world = this;
    }

    run = () => {
        this.checkEnemyCollisions();
        this.checkThrownObjects();
    };

    checkThrownObjects() {
        if (this.availableBottles > 0) {
            if (this.keyboard.D) {
                const bottle = new ThrowableObject(
                    this.character.x + 100,
                    this.character.y + 100,
                );
                this.throwableObjects.push(bottle);
                this.availableBottles--;
                this.bottleBar.setCount(this.availableBottles);
            }
        } else if (this.availableBottles === 0 && this.keyboard.D) {
            this.bottleError = true;
            setTimeout(() => {
                this.bottleError = false;
            }, 1200);
        }
    }

    checkEnemyCollisions() {
        this.level.enemies.forEach((enemy) => {
            if (this.character.isColliding(enemy)) {
                this.character.hit(5);
                this.healthBar.setPercentage(
                    this.character.energy,
                    this.healthBar.imgPath,
                );
            }
            // this.throwableObjects.forEach((thrObj) => {
            //     if (thrObj.isColliding(enemy)) {
            //         enemy.hit();
            //         console.log(enemy.energy);
            //     }
            // });
        });
    }

    checkBottleDamage = () => {
        this.throwableObjects.forEach((bottle) => {
            this.level.enemies.forEach((enemy) => {
                if (enemy.isColliding(bottle)) {
                    enemy.hit(50);
                    console.log(enemy.energy);
                }
            });
        });
    };

    checkCoinCollision = () => {
        this.level.coins = this.level.coins.filter((coin) => {
            if (this.character.isColliding(coin)) {
                coin.collected = true;
                this.collectedCoins++;
                this.coinBar.setCount(this.collectedCoins);
                return false;
            }
            return true;
        });
    };

    checkBootleCollision = () => {
        this.level.bottles = this.level.bottles.filter((bottle) => {
            if (this.character.isColliding(bottle)) {
                bottle.collected = true;
                this.availableBottles++;
                this.bottleBar.setCount(this.availableBottles);
                return false;
            }
            return true;
        });
    };

    drawErrorMsg() {
        if (this.bottleError === true) {
            const x = 290;
            const y = 200;
            this.ctx.font = "24px Alfa Slab One";
            this.ctx.fillStyle = "rgba(130, 35, 0, 1)";
            this.ctx.fillText("no Bottles", x, y);
            this.ctx.strokeStyle = "rgb(255, 255, 255)";
            this.ctx.lineWidth = 1;
            this.ctx.strokeText("no Bottles...", x, y);
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); //am Anfang wird canvas immer geleert
        this.ctx.translate(this.camera_x, 0); //Map wird nach links verschoben
        this.addObjectsToMap(this.level.backgroundObjects); //Objekte werden eingefügt bzw. "gezeichnet"
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.level.bottles);

        this.ctx.translate(-this.camera_x, 0); // Kameraperspektive zurücksetzen
        // ------ Space for fixed objects ------
        this.addToMap(this.healthBar);
        this.addToMap(this.bottleBar);
        this.addToMap(this.coinBar);
        this.addToMap(this.endbossBar);
        this.drawErrorMsg();
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
        if (mO.drawCount) {
            mO.drawCount(this.ctx);
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
