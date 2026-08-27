import { level1 } from "../levels/level1.js";
import { Character } from "./character.class.js";
import { IntervalHub } from "../scripts/intervall-hub.class.js";
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

    // enemyCollisions und thrownObj. werden im selben Intervall wiederholt, etwas langsamer, damit nicht zu viele Treffer auf einmal bzw. nicht zu viele Bottles geworfen werden
    run = () => {
        this.checkEnemyCollisions();
        this.checkThrownObjects();
    };

    // prüfen, ob genügend throwable Obj. vorhanden sind
    checkThrownObjects() {
        if (this.availableBottles > 0) {
            // -> wenn availableBottles > 0, dann kann mit "D" eine Flasche geworfen werden.
            if (this.keyboard.D) {
                const bottle = new ThrowableObject(
                    this.character.x + 100,
                    this.character.y + 100,
                );
                this.throwableObjects.push(bottle);
                this.availableBottles--; // wenn eine Flasche geworfen wurde, dann wird von available Bottles 1 abgezogen
                this.bottleBar.setCount(this.availableBottles); // der counter der bottleBar wird entsprechend um 1 nach unten angepasst
            }
        } else if (this.availableBottles === 0 && this.keyboard.D) {
            // -> wenn nicht genügend Flaschen UND D wird gedrückt
            this.bottleError = true; // bottleError wird aktiviert, damit wird die Anzeige "no Bottles" gezeichnet in draw()
            setTimeout(() => {
                // mit einem Timeout wird Error wieder auf false gesetzt, damit der Text wieder verschwindet (wird nur gezeichnet bei true)
                this.bottleError = false;
            }, 1200);
        }
    }

    // für jeden Gegner wird (oben im Interval) geprüft, ob der Gegner kollidiert
    checkEnemyCollisions() {
        this.level.enemies.forEach((enemy) => {
            if (this.character.isColliding(enemy)) {
                // wenn Kollision:
                this.character.hit(5); // hit mit damage-Parameter übergeben, um entsprechend viel Schaden abzuziehen
                this.healthBar.setPercentage(
                    // healthbar wird aktualisiert, indem die aktuelle Energie (nachdem damage abgezogen wurde) u. die Bilder der Bar übergben werden
                    this.character.energy,
                    this.healthBar.imgPath,
                );
            }
        });
    }

    // im Interval wird geprüft, ob für jede Flasche für jeden Gegner eine Kollision erfolgt
    checkBottleDamage = () => {
        this.throwableObjects.forEach((bottle) => {
            this.level.enemies.forEach((enemy) => {
                if (enemy.isColliding(bottle) && !bottle.isSplashing) {
                    // wenn Kollision Gegner mit Flasche: über hit Schadenszahl übergeben
                    enemy.hit(50);
                    bottle.hit(100);
                    bottle.splash();
                }
            });
        });
        this.throwableObjects = this.throwableObjects.filter(
            (bottle) => !bottle.removeBottle,
        );
    };

    // im Intervall prüfen, ob CHaracter mit Münzen kollidiert (für JEDE Münze!)
    checkCoinCollision = () => {
        this.level.coins = this.level.coins.filter((coin) => {
            if (this.character.isColliding(coin)) {
                // wenn Kollision: collectedCoins +1, count der coin-bar aktualisieren
                this.collectedCoins++;
                this.coinBar.setCount(this.collectedCoins);
                return false; // der filter-methode sagen "Münze ist jetzt raus"
            }
            return true; // der filter-Methode sagen "Münze bleibt drin / es passiert nichts"
        });
    };

    // Prüfung Koll. CHar + Bottle
    checkBootleCollision = () => {
        this.level.bottles = this.level.bottles.filter((bottle) => {
            if (this.character.isColliding(bottle)) {
                //availBott +1, bar-count +1
                this.availableBottles++;
                this.bottleBar.setCount(this.availableBottles);
                return false; // bottle raus
            }
            return true; // bottle bleibt drin bzw. passiert nichts
        });
    };

    // zeichnen der Mitteilung, dass keine Flaschen zum Werfen vorhanden -- nur zeichnen, wenn true!
    drawErrorMsg() {
        // x/y werden festgelegt, font, farbe stylt den Text
        if (this.bottleError === true) {
            const x = 290;
            const y = 200;
            this.ctx.font = "24px Alfa Slab One";
            this.ctx.fillStyle = "rgba(130, 35, 0, 1)";
            this.ctx.fillText("no Bottles", x, y); // mit x,y sagen, wo text stehen soll
            this.ctx.strokeStyle = "rgb(255, 255, 255)"; // für Umrandung extra methode definieren
            this.ctx.lineWidth = 1;
            this.ctx.strokeText("no Bottles...", x, y);
        }
    }

    // leinwand wird anfangs geleert, dann wird Kamera bewegt und Objekte werden hinzugefügt
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

    // die entsprechenden Objekte werden hinzugefügt
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

    // Bild wird gespiegelt, wenn sich chara in andere Richtung bewegt
    flipImage(mO) {
        this.ctx.save();
        this.ctx.translate(mO.width, 0);
        this.ctx.scale(-1, 1);
        mO.x = mO.x * -1;
    }

    // Bild wieder zurückdrehen
    flipImageBack(mO) {
        mO.x = mO.x * -1;
        this.ctx.restore();
    }
}
