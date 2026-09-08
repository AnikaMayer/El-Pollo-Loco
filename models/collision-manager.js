import { AudioHub } from "../scripts/audio-hub.class.js";
import { IntervalHub } from "../scripts/intervall-hub.class.js";

/**
 * Manages all collision detection between game objects.
 * Handles enemy collisions, jump-on-enemy mechanics and bottle damage.
 */
export class CollisionManager {
    /**
     * Creates a new CollisionManager and starts the enemy collision interval.
     * @param {World} world - The game world instance to operate on.
     */
    constructor(world) {
        this.world = world;
        IntervalHub.startInterval(this.checkEnemyCollisions, 1000 / 5);
    }

    //#region damage

    /**
     * Applies damage to an enemy when hit by a bottle that has not yet splashed.
     * Stops the bottle, triggers the splash and deals damage based on enemy type.
     * @param {MovableObject} enemy - The enemy to check collision against.
     * @param {ThrowableObject} bottle - The thrown bottle to check.
     */
    causeDamage(enemy, bottle) {
        if (enemy.isColliding(bottle) && !bottle.isSplashing) {
            this.checkEnemyType(enemy);
            bottle.stopFalling();
            bottle.hit(100);
            bottle.splash();
        }
    }

    /**
     * Deals 10 damage to the character when colliding with a living enemy,
     * provided the character is not currently in a hurt state.
     * Updates the health bar accordingly.
     * @param {MovableObject} enemy - The enemy to check collision against.
     */
    damageCharacter(enemy) {
        if (
            this.world.character.isColliding(enemy) &&
            !enemy.isDead() &&
            !this.world.character.isHurt()
        ) {
            this.world.character.hit(10);
            this.world.healthBar.setPercentage(
                this.world.character.energy,
                this.world.healthBar.imgPath,
            );
        }
    }

    /**
     * Deals damage to an enemy based on its type.
     * The endboss takes 20 damage and updates the endboss bar; other enemies take 50.
     * @param {MovableObject} enemy - The enemy to damage.
     */
    checkEnemyType(enemy) {
        if (enemy === this.world.endboss) {
            enemy.hit(20);
            this.world.endbossBar.setPercentage(
                this.world.endboss.energy,
                this.world.endbossBar.imgPath,
            );
        } else {
            enemy.hit(50);
        }
    }

    //#endregion

    //#region collisionCheck

    /**
     * Checks all enemies for collision with the character each interval tick.
     * Skips damage if a jump collision is currently being handled.
     * @type {Function}
     */
    checkEnemyCollisions = () => {
        if (this.checkJumpCollision()) {
            return;
        } else {
            this.world.level.enemies.forEach((enemy) => {
                this.damageCharacter(enemy);
            });
        }
    };

    /**
     * Checks whether the character is jumping onto an enemy from above.
     * Triggers a bounce and deals damage on landing. The endboss is excluded.
     */
    checkJumpCollision() {
        this.world.level.enemies.forEach((enemy) => {
            if (enemy === this.world.endboss) {
                return;
            }
            if (this.world.character.isCollidingFromAbove(enemy)) {
                this.world.character.jumpOnMovObj(enemy);
                AudioHub.playOne(AudioHub.CHARACTER.bounce);
                this.checkEnemyType(enemy);
            }
        });
    }

    //#endregion
}
