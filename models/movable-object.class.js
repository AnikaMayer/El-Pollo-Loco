import { AudioHub } from "../scripts/audio-hub.class.js";
import { DrawableObject } from "./drawable-object.class.js";

export class MovableObject extends DrawableObject {
    speed = 0.15;
    speedY = 0;
    acceleration = 3;
    otherDirection = false;
    energy = 100;
    lastHit = 0;
    lastAnimation = 0;
    keepFalling = false;
    world;
    deathJump = false;
    movingLeft;
    soundPlayed = false;
    rX;
    rY;
    rW;
    rH;

    getRealFrame() {
        this.rX = this.x + this.offset.left;
        this.rY = this.y + this.offset.top;
        this.rW = this.width - this.offset.left - this.offset.right;
        this.rH = this.height - this.offset.top - this.offset.bottom;
    }

    applyGravity = () => {
        if (this.isDead() && !this.keepFalling) {
            return; // Objekte können nicht mehr fallen, wenn sie zerstört sind
        }
        if (this.isAboveGround() || this.speedY > 0) {
            this.y -= this.speedY;
            this.speedY -= this.acceleration;
        }
    };

    isAboveGround() {
        if (this.keepFalling) {
            // throwable Object soll immer fallen
            return true;
        } else {
            return this.y < 180;
        }
    }

    // z.B.:character.isColliding(chicken);
    // funktioniert, indem wir den offset-Rahmen holen
    isColliding(mO) {
        if (!this.isDead()) {
            this.getRealFrame();
            mO.getRealFrame();
            return (
                this.rX + this.rW > mO.rX &&
                this.rY + this.rH > mO.rY &&
                this.rX < mO.rX + mO.rW &&
                this.rY < mO.rY + mO.rH
            );
        }
    }

    // nutzt isColliding-Methode UND muss über mO liegen (nur, wenn mO nicht tot ist!)
    isCollidingFromAbove(mO) {
        return (
            this.isColliding(mO) &&
            this.speedY < 0 &&
            this.isAboveGround() &&
            !mO.isDead()
        );
    }

    // wenn collidingFromAbove bei collision(wolrd.class) true: dann neuer y-Wert zugewiesen + bounce(kurzer Sprung)
    jumpOnMovObj(mO) {
        this.y = mO.y + mO.offset.top - this.height;
        this.bounce();
    }

    // bei Kollision kriegt jedes Movable Obj. einen Treffer, bei dem ein übergebener Schaden von der vordefinierten Energie abgezogen wird
    // also: damage = 50: von energey(100) werden 50 abgezogen, bleiben 50 übrig.
    hit(damage) {
        this.energy -= damage;
        if (this.energy < 0) {
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();
        }
        if (this.energy === 0) {
            this.speed = 0;
            if (this.deathJump) {
                this.keepFalling = true;
                this.speedY = 30;
            }
        }
    }

    // Animation soll laufen nach Treffer, erst dann kommt der nächste hit()
    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit; // Difference in ms
        timepassed = timepassed / 1000; // Difference in s
        return timepassed < 1;
    }

    isDead() {
        return this.energy === 0; // wenn 0, wird "isDead()" zurückgegen, Aufruf dann im Objekt selbst unter animate
    }

    playAnimation(images, animationSpeed) {
        if (this.animateNext(animationSpeed)) {
            let i = this.currentImage % images.length; //i = 0 % 6 => 0, Rest 0 | 5 % 6 => 0, R 5 | 6 % 6 => 1, R 0 | 7 % 6 => 1, R 1
            let path = images[i]; // i = 0, 1, 2, 3, 4, 5, 6, 0, 1, 2, 3, 4, 5, 6, 0, 1, 2, 3, 4, 5, 6, 0 usw....
            this.img = this.imageCache[path];
            this.currentImage++;
            this.lastAnimation = new Date().getTime();
        }
    }

    animateNext(animationSpeed) {
        let timepassed = new Date().getTime() - this.lastAnimation;
        return timepassed > animationSpeed;
    }

    // wenn Bedingung erfüllt, wird über path sound abgespielt, sonst stoppt Sound
    playSound(sound, playing) {
        if (playing) {
            AudioHub.playOne(sound);
        } else {
            AudioHub.stopOne(sound);
        }
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

    // kurzer Sprung, nachdem Char auf Gegner gesprungen ist
    bounce() {
        this.speedY = 20;
    }
}
