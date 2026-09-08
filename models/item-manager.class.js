import { AudioHub } from "../scripts/audio-hub.class.js";
import { IntervalHub } from "../scripts/intervall-hub.class.js";
import { ThrowableObject } from "./items/throwable-object.class.js";

/**
 * Manages item collection and bottle throwing logic.
 * Handles coin and bottle pickup, throwing mechanics and bottle-enemy collisions.
 */
export class ItemManager {
    /**
     * Creates a new ItemManager and starts the bottle damage interval.
     * @param {World} world - The game world instance to operate on.
     */
    constructor(world) {
        this.world = world;
        IntervalHub.startInterval(this.checkBottleDamage, 1000 / 10);
    }

    //#region throwBottle

    /**
     * Checks whether the player can throw a bottle.
     * Shows an error message if D is pressed but no bottles are available.
     */
    checkThrownObjects() {
        if (this.world.availableBottles > 0) {
            this.throwObjects();
        } else if (
            this.world.availableBottles === 0 &&
            this.world.keyboard.D &&
            this.canThrow()
        ) {
            this.world.bottleError = true;
            setTimeout(() => {
                this.world.bottleError = false;
            }, 1200);
        }
    }

    /**
     * Returns the starting x-position of a thrown bottle based on the character's facing direction.
     * @returns {number} The x-position for the new throwable object.
     */
    getBottleX() {
        return this.world.character.otherDirection
            ? this.world.character.x - 50
            : this.world.character.x + 100;
    }

    /**
     * Creates and throws a bottle when D is pressed and the throw cooldown has elapsed.
     * Decrements the available bottle count and updates the HUD.
     */
    throwObjects() {
        if (this.world.keyboard.D && this.canThrow()) {
            const bottleX = this.getBottleX();
            const bottle = new ThrowableObject(
                bottleX,
                this.world.character.y + 100,
                this.world.character.otherDirection,
            );
            this.world.throwableObjects.push(bottle);
            this.world.availableBottles--;
            this.world.bottleBar.setCount(this.world.availableBottles);
            this.world.lastThrow = new Date().getTime();
        }
    }

    /**
     * Checks whether enough time has passed since the last throw (cooldown: 500ms).
     * @returns {boolean} True if the player is allowed to throw.
     */
    canThrow() {
        let timepassed = new Date().getTime() - this.world.lastThrow;
        return timepassed > 500;
    }

    /**
     * Checks each thrown bottle against each enemy for collision and applies damage.
     * Removes bottles marked for removal after splashing.
     * @type {Function}
     */
    checkBottleDamage = () => {
        this.world.throwableObjects.forEach((bottle) => {
            this.world.level.enemies.forEach((enemy) => {
                this.world.collisionManager.causeDamage(enemy, bottle);
            });
        });
        this.world.throwableObjects = this.world.throwableObjects.filter(
            (bottle) => !bottle.removeBottle,
        );
    };

    //#endregion

    //#region collectItems

    /**
     * Checks whether the character is colliding with any coin.
     * Collected coins are removed from the level and the coin counter is updated.
     */
    collectCoins() {
        this.world.level.coins = this.world.level.coins.filter((coin) => {
            if (this.world.character.isColliding(coin)) {
                this.world.collectedCoins++;
                this.world.coinBar.setCount(this.world.collectedCoins);
                AudioHub.playOne(AudioHub.ITEMS.coin);
                return false;
            }
            return true;
        });
    }

    /**
     * Checks whether the character is colliding with any bottle on the ground.
     * Collected bottles are removed from the level and the bottle counter is updated.
     */
    collectBottles() {
        this.world.level.bottles = this.world.level.bottles.filter((bottle) => {
            if (this.world.character.isColliding(bottle)) {
                this.world.availableBottles++;
                this.world.bottleBar.setCount(this.world.availableBottles);
                AudioHub.playOne(AudioHub.ITEMS.bottle);
                return false;
            }
            return true;
        });
    }

    //#endregion
}
