import { DrawableObject } from "./drawable-object.class.js";

export class MovableObject extends DrawableObject {
    speed = 0.15;
    speedY = 0;
    acceleration = 2.5;
    otherDirection = false;
    energy = 100;
    lastHit = 0;
    keepFalling = false;

    applyGravity() {
        setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
        }, 1000 / 25);
    }

    isAboveGround() {
        if (this.keepFalling) {
            // throwable Object soll immer fallen
            return true;
        } else {
            return this.y < 180;
        }
    }

    //z.B.:character.isColliding(chicken);
    isColliding(mO) {
        return (
            this.x + this.width > mO.x &&
            this.y + this.height > mO.y &&
            this.x < mO.x + mO.width &&
            this.y < mO.y + mO.height
        );
    }

    hit() {
        this.energy -= 5;
        if (this.energy < 0) {
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();
        }
    }

    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit; // Difference in ms
        timepassed = timepassed / 1000; // Difference in s
        return timepassed < 1;
    }

    isDead() {
        return this.energy === 0;
    }

    playAnimation(images) {
        let i = this.currentImage % images.length; //i = 0 % 6 => 0, Rest 0 | 5 % 6 => 0, R 5 | 6 % 6 => 1, R 0 | 7 % 6 => 1, R 1
        let path = images[i]; // i = 0, 1, 2, 3, 4, 5, 6, 0, 1, 2, 3, 4, 5, 6, 0, 1, 2, 3, 4, 5, 6, 0 usw....
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    moveRight() {
        this.x += this.speed;
    }

    moveLeft() {
        this.x -= this.speed;
    }

    jump() {
        this.speedY = 30;
    }
}
