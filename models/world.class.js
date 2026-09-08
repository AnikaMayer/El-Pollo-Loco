import { level1 } from "../levels/level1.js";
import { Character } from "./character.class.js";
import { IntervalHub } from "../scripts/intervall-hub.class.js";
import { HealthBar } from "./statusbars/health-bar.class.js";
import { BottleBar } from "./statusbars/bottle-bar.class.js";
import { CoinBar } from "./statusbars/coin-bar.class.js";
import { EndbossBar } from "./statusbars/endboss-bar.class.js";
import { Endboss } from "./enemies/endboss.class.js";
import { Endscreen } from "./endscreen.class.js";
import { AudioHub } from "../scripts/audio-hub.class.js";
import { CollisionManager } from "./collision-manager.js";
import { ItemManager } from "./item-manager.class.js";

/**
 * Represents the game world and acts as the central controller.
 * Manages the game loop, all game objects, collisions, item collection,
 * HUD rendering and game end logic.
 */
export class World {
    /** @type {Character} The player character. */
    character = new Character();
    /** @type {Level} The current level instance. */
    level = level1;
    /** @type {Endboss} Reference to the endboss found in the level's enemies array. */
    endboss = this.level.enemies.find((boss) => boss instanceof Endboss);
    /** @type {HTMLCanvasElement} The canvas element used for rendering. */
    canvas;
    /** @type {CanvasRenderingContext2D} The 2D rendering context of the canvas. */
    ctx;
    /** @type {Object} The keyboard input state. */
    keyboard;
    /** @type {number} The current camera offset on the x-axis. */
    camera_x = 0;
    /** @type {HealthBar} The player's health bar HUD element. */
    healthBar = new HealthBar();
    /** @type {BottleBar} The bottle count HUD element. */
    bottleBar = new BottleBar();
    /** @type {CoinBar} The coin count HUD element. */
    coinBar = new CoinBar();
    /** @type {EndbossBar} The endboss health bar HUD element. */
    endbossBar = new EndbossBar();
    /** @type {ThrowableObject[]} All currently active throwable bottle objects. */
    throwableObjects = [];
    /** @type {number} Timestamp of the last thrown bottle, used for throw cooldown. */
    lastThrow = 0;
    /** @type {number} The total number of coins in the level. */
    totalCoins = this.level.coins.length;
    /** @type {number} The number of coins collected by the player so far. */
    collectedCoins = 0;
    /** @type {number} The total number of bottles in the level. */
    totalBottles = this.level.bottles.length;
    /** @type {number} The number of bottles currently available to throw. */
    availableBottles = 0;
    /** @type {boolean} Whether to show the "no bottles" error message. */
    bottleError = false;
    /** @type {boolean} Whether the game has ended. */
    gameEnd = false;
    /** @type {Endscreen} The end screen overlay shown on win or lose. */
    endscreen = new Endscreen();
    /** @type {number} The ID returned by requestAnimationFrame for the draw loop. */
    drawID;
    /** @type {Function|undefined} Optional callback invoked when the game ends. */
    onEndScreen;
    /** @type {CollisionManager} Manages all collision detection logic. */
    collisionManager;
    /** @type {ItemManager} Manages item collection and bottle throwing logic. */
    itemManager;

    /**
     * Creates a new World, sets up the canvas context, starts the draw loop
     * and registers all game intervals.
     * @param {HTMLCanvasElement} _canvas - The canvas element to render on.
     * @param {Object} _keyboard - The keyboard input state object.
     */
    constructor(_canvas, _keyboard) {
        this.ctx = _canvas.getContext("2d");
        this.canvas = _canvas;
        this.keyboard = _keyboard;
        this.draw();
        this.setWorld();
        this.collisionManager = new CollisionManager(this);
        this.itemManager = new ItemManager(this);
        IntervalHub.startInterval(this.run, 1000 / 60);
    }

    /**
     * Assigns the world reference to the character and endboss
     * so they can access world state.
     */
    setWorld() {
        this.character.world = this;
        this.endboss.world = this;
    }

    /**
     * The main game logic loop. Runs at 60fps and handles
     * item collection, collisions, thrown objects and game end checks.
     * @type {Function}
     */
    run = () => {
        this.itemManager.collectCoins();
        this.itemManager.collectBottles();
        this.itemManager.checkThrownObjects();
        this.checkGameEnd();
    };

    //#region draw

    /**
     * The main render loop. Clears the canvas, applies camera translation
     * and draws all game objects in the correct layer order.
     * Calls itself recursively via requestAnimationFrame.
     */
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.translate(this.camera_x, 0);
        this.drawBackground();
        this.drawCollectibles();
        this.ctx.translate(-this.camera_x, 0);
        this.drawHUD();
        this.ctx.translate(this.camera_x, 0);
        this.drawMovableObj();
        this.ctx.translate(-this.camera_x, 0);
        this.drawEndscreen();
        this.drawID = requestAnimationFrame(() => this.draw());
    }

    /**
     * Draws all background objects and clouds onto the canvas.
     */
    drawBackground() {
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.clouds);
    }

    /**
     * Draws all collectible coins and bottles while the game is still running.
     */
    drawCollectibles() {
        if (this.gameEnd === false) {
            this.addObjectsToMap(this.level.coins);
            this.addObjectsToMap(this.level.bottles);
        }
    }

    /**
     * Draws all HUD elements (health, bottles, coins, endboss bar, error message)
     * while the game is still running.
     */
    drawHUD() {
        if (this.gameEnd === false) {
            this.addToMap(this.healthBar);
            this.addToMap(this.bottleBar);
            this.addToMap(this.coinBar);
            this.checkBossEncounter();
            this.drawErrorMsg();
        }
    }

    /**
     * Triggers the endboss encounter when the character reaches x ≥ 4400,
     * and adds the endboss health bar to the HUD.
     */
    checkBossEncounter() {
        if (this.character.x >= 4400) {
            this.endboss.encounter = true;
        }
        if (this.endboss.encounter === true) {
            this.addToMap(this.endbossBar);
        }
    }

    /**
     * Draws a "no Bottles" error message on the canvas when the player
     * tries to throw without any bottles available.
     */
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

    /**
     * Draws all enemies, the character and all throwable objects
     * while the game is still running.
     */
    drawMovableObj() {
        if (this.gameEnd === false) {
            this.addObjectsToMap(this.level.enemies);
            this.addToMap(this.character);
            this.addObjectsToMap(this.throwableObjects);
        }
    }

    /**
     * Draws the end screen overlay when the game has ended.
     * Stops all intervals and dims the background before showing the win or lose screen.
     */
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

    /**
     * Checks whether the game should end because the endboss or character has died.
     * Triggers the win or lose state accordingly with a 1 second delay.
     */
    checkGameEnd() {
        if (this.gameEnd === false) {
            if (this.endboss.isDead()) {
                this.setWinState();
            } else if (this.character.isDead()) {
                this.setLoseState();
            }
        }
    }

    /**
     * Triggers the win sequence after a 1 second delay:
     * ends the game, stops background music and plays the win sound.
     */
    setWinState() {
        setTimeout(() => {
            this.endGame("win");
            AudioHub.stopOne(AudioHub.GAME.bgm);
            AudioHub.playOne(AudioHub.GAME.win);
        }, 1000);
    }

    /**
     * Triggers the lose sequence after a 1 second delay:
     * ends the game, stops background music and plays the game over sound.
     */
    setLoseState() {
        setTimeout(() => {
            this.endGame("lose");
            AudioHub.stopOne(AudioHub.GAME.bgm);
            AudioHub.playOne(AudioHub.GAME.gameOver);
        }, 1000);
    }

    /**
     * Finalizes the game by setting the game end flag, updating the end screen state
     * and invoking the optional onEndScreen callback.
     * @param {'win' | 'lose'} state - The outcome state to display.
     */
    endGame(state) {
        if (this.onEndScreen) {
            this.onEndScreen();
        }
        this.gameEnd = true;
        this.endscreen.setState(state);
    }

    /**
     * Draws an array of objects onto the canvas by calling addToMap for each.
     * @param {DrawableObject[]} objects - The array of objects to draw.
     */
    addObjectsToMap(objects) {
        objects.forEach((_object) => {
            this.addToMap(_object);
        });
    }

    /**
     * Draws a single object onto the canvas, handling horizontal flipping
     * and optional hitbox and count rendering.
     * @param {DrawableObject} mO - The object to draw.
     */
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

    /**
     * Flips the canvas context horizontally to mirror an object facing left.
     * @param {DrawableObject} mO - The object to flip.
     */
    flipImage(mO) {
        this.ctx.save();
        this.ctx.translate(mO.width, 0);
        this.ctx.scale(-1, 1);
        mO.x = mO.x * -1;
    }

    /**
     * Restores the canvas context after flipping an object back to its original orientation.
     * @param {DrawableObject} mO - The object to restore.
     */
    flipImageBack(mO) {
        mO.x = mO.x * -1;
        this.ctx.restore();
    }

    //#endregion
}
