import { level1 } from "../levels/level1.js";
import { Character } from "./character.class.js";
import { IntervalHub } from "../scripts/intervall-hub.class.js";
import { HealthBar } from "./health-bar.class.js";
import { ThrowableObject } from "./throwable-object.class.js";
import { BottleBar } from "./bottle-bar.class.js";
import { CoinBar } from "./coin-bar.class.js";
import { EndbossBar } from "./endboss-bar.class.js";
import { Endboss } from "./endboss.class.js";
import { Endscreen } from "./endscreen.class.js";

export class World {
    character = new Character();
    level = level1;
    endboss = this.level.enemies.find((boss) => boss instanceof Endboss);
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    healthBar = new HealthBar();
    bottleBar = new BottleBar();
    coinBar = new CoinBar();
    endbossBar = new EndbossBar();
    throwableObjects = [];
    lastThrow = 0;
    totalCoins = this.level.coins.length;
    collectedCoins = 0;
    totalBottles = this.level.bottles.length;
    availableBottles = 80;
    bottleError = false;
    gameEnd = false;
    endscreen = new Endscreen();

    constructor(_canvas, _keyboard) {
        this.ctx = _canvas.getContext("2d");
        this.canvas = _canvas;
        this.keyboard = _keyboard;
        this.draw();
        this.setWorld();
        IntervalHub.startInterval(this.checkEnemyCollisions, 1000 / 5);
        IntervalHub.startInterval(this.checkBottleDamage, 1000 / 10);
        IntervalHub.startInterval(this.run, 1000 / 60);
    }

    setWorld() {
        this.character.world = this;
    }

    // enemyCollisions und thrownObj. werden im selben Intervall wiederholt, etwas langsamer, damit nicht zu viele Treffer auf einmal bzw. nicht zu viele Bottles geworfen werden
    run = () => {
        this.collectCoins();
        this.collectBottles();
        this.checkJumpCollision();
        this.checkThrownObjects();
        this.checkGameEnd();
    };

    // prüfen, ob genügend throwable Obj. vorhanden sind
    checkThrownObjects() {
        if (this.availableBottles > 0) {
            // -> wenn availableBottles > 0, dann kann mit "D" eine Flasche geworfen werden.
            this.throwObjects();
        } else if (
            this.availableBottles === 0 &&
            this.keyboard.D &&
            this.canThrow()
        ) {
            // -> wenn nicht genügend Flaschen UND D wird gedrückt
            this.bottleError = true; // bottleError wird aktiviert, damit wird die Anzeige "no Bottles" gezeichnet in draw()
            setTimeout(() => {
                // mit einem Timeout wird Error wieder auf false gesetzt, damit der Text wieder verschwindet (wird nur gezeichnet bei true)
                this.bottleError = false;
            }, 1200);
        }
    }

    getBottleX() {
        return this.character.otherDirection
            ? this.character.x - 50
            : this.character.x + 100;
    }

    // der Ablauf beim Werfen des Objekts
    throwObjects() {
        if (this.keyboard.D && this.canThrow()) {
            const bottleX = this.getBottleX();
            const bottle = new ThrowableObject(
                bottleX,
                this.character.y + 100,
                this.character.otherDirection,
            );
            this.throwableObjects.push(bottle);
            this.availableBottles--; // wenn eine Flasche geworfen wurde, dann wird von available Bottles 1 abgezogen
            this.bottleBar.setCount(this.availableBottles); // der counter der bottleBar wird entsprechend um 1 nach unten angepasst
            this.lastThrow = new Date().getTime();
        }
    }

    // cooldown zum Werfen, damit nicht mehrere gleichzeitig geworfen werden
    canThrow() {
        let timepassed = new Date().getTime() - this.lastThrow;
        return timepassed > 500;
    }

    // für jeden Gegner wird (oben im Interval) geprüft, ob der Gegner kollidiert
    checkEnemyCollisions = () => {
        if (this.checkJumpCollision()) {
            return;
        } else {
            this.level.enemies.forEach((enemy) => {
                if (
                    this.character.isColliding(enemy) &&
                    !enemy.isDead() &&
                    !this.character.isHurt()
                ) {
                    // wenn Kollision:
                    this.character.hit(10); // hit mit damage-Parameter übergeben, um entsprechend viel Schaden abzuziehen
                    this.healthBar.setPercentage(
                        // healthbar wird aktualisiert, indem die aktuelle Energie (nachdem damage abgezogen wurde) u. die Bilder der Bar übergben werden
                        this.character.energy,
                        this.healthBar.imgPath,
                    );
                }
            });
        }
    };

    // Charakter springt auf Gegner, um ihm Schaden zuzufügen, ohne dabei selbst zu erleiden -> dabei springt er ab
    checkJumpCollision() {
        this.level.enemies.forEach((enemy) => {
            if (this.character.isCollidingFromAbove(enemy)) {
                this.character.jumpOnMovObj(enemy); // hier wir dem Char neuer y-wert zugewiesen, siehe movableObj
                enemy.hit(50);
            }
        });
    }

    // im Interval wird geprüft, ob für jede Flasche für jeden Gegner eine Kollision erfolgt
    checkBottleDamage = () => {
        this.throwableObjects.forEach((bottle) => {
            this.level.enemies.forEach((enemy) => {
                this.causeDamage(enemy, bottle);
            });
        });
        this.throwableObjects = this.throwableObjects.filter(
            (bottle) => !bottle.removeBottle,
        );
    };

    // Schaden definieren nach Gegnertyp, für Endboss Statusbar updaten
    causeDamage(enemy, bottle) {
        if (enemy.isColliding(bottle) && !bottle.isSplashing) {
            // wenn Kollision Gegner mit Flasche: über hit Schadenszahl übergeben
            if (enemy === this.endboss) {
                enemy.hit(20);
                this.endbossBar.setPercentage(
                    this.endboss.energy,
                    this.endbossBar.imgPath,
                );
            } else {
                enemy.hit(50);
            }
            bottle.stopFalling();
            bottle.hit(100);
            bottle.splash();
        }
    }

    // im Intervall prüfen, ob CHaracter mit Münzen kollidiert (für JEDE Münze!)
    collectCoins() {
        this.level.coins = this.level.coins.filter((coin) => {
            if (this.character.isColliding(coin)) {
                // wenn Kollision: collectedCoins +1, count der coin-bar aktualisieren
                this.collectedCoins++;
                this.coinBar.setCount(this.collectedCoins);
                return false; // der filter-methode sagen "Münze ist jetzt raus"
            }
            return true; // der filter-Methode sagen "Münze bleibt drin / es passiert nichts"
        });
    }

    // Prüfung Koll. CHar + Bottle
    collectBottles() {
        this.level.bottles = this.level.bottles.filter((bottle) => {
            if (this.character.isColliding(bottle)) {
                //availBott +1, bar-count +1
                this.availableBottles++;
                this.bottleBar.setCount(this.availableBottles);
                return false; // bottle raus
            }
            return true; // bottle bleibt drin bzw. passiert nichts
        });
    }

    // leinwand wird anfangs geleert, dann wird Kamera bewegt und Objekte werden hinzugefügt
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); //am Anfang wird canvas immer geleert
        this.ctx.translate(this.camera_x, 0); //Map wird nach links verschoben
        this.drawBackground();
        this.drawCollectibles();
        this.ctx.translate(-this.camera_x, 0); // Kameraperspektive zurücksetzen
        // ------ Space for fixed objects ------
        this.drawHUD();
        this.ctx.translate(this.camera_x, 0); // Kameraperspektive wieder positionieren
        this.drawMovableObj();
        this.ctx.translate(-this.camera_x, 0); //Map wird wieder nach rechts verschoben
        this.drawEndscreen();
        requestAnimationFrame(() => this.draw()); // draw() wird immer wieder aufgerufen
    }

    drawBackground() {
        this.addObjectsToMap(this.level.backgroundObjects); //Objekte werden eingefügt bzw. "gezeichnet"
        this.addObjectsToMap(this.level.clouds);
    }

    drawCollectibles() {
        if (this.gameEnd === false) {
            this.addObjectsToMap(this.level.coins);
            this.addObjectsToMap(this.level.bottles);
        }
    }

    drawHUD() {
        if (this.gameEnd === false) {
            this.addToMap(this.healthBar);
            this.addToMap(this.bottleBar);
            this.addToMap(this.coinBar);
            this.checkBossEncounter(); //health-bar endboss zur Map
            this.drawErrorMsg();
        }
    }

    checkBossEncounter() {
        if (this.character.x >= 2800) {
            this.endboss.encounter = true;
        }
        if (this.endboss.encounter === true) {
            this.addToMap(this.endbossBar);
        }
    }

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

    drawMovableObj() {
        if (this.gameEnd === false) {
            this.addObjectsToMap(this.level.enemies);
            this.addToMap(this.character);
            this.addObjectsToMap(this.throwableObjects);
        }
    }

    // wenn Spiel zu Ende, entsprechenden Bildschirm anzeigen
    drawEndscreen() {
        if (this.gameEnd === true) {
            IntervalHub.stopAllIntervals();
            this.ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            if (
                this.endscreen.state === "win" ||
                this.endscreen.state === "lose"
            ) {
                this.addToMap(this.endscreen);
            }
        }
    }

    // prüfen, ob das Spiel zu Ende ist, weil CHarakter oder Boss keine Energie mehr haben
    checkGameEnd() {
        //wenn das Ende schon abläuft, soll nicht weiter geprüft werden
        if (this.gameEnd === false) {
            if (this.endboss.isDead()) {
                setTimeout(() => {
                    this.gameEnd = true;
                    this.endscreen.setState("win");
                }, 1000);
            } else if (this.character.isDead()) {
                setTimeout(() => {
                    this.gameEnd = true;
                    this.endscreen.setState("lose");
                }, 1000);
            }
        }
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
