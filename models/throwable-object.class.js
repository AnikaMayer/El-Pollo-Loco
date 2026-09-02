import { AudioHub } from "../scripts/audio-hub.class.js";
import { ImageHub } from "../scripts/img-hub.class.js";
import { IntervalHub } from "../scripts/intervall-hub.class.js";
import { MovableObject } from "./movable-object.class.js";

export class ThrowableObject extends MovableObject {
    imgPath = ImageHub.BOTTLE;
    keepFalling = true;
    // showFrame = true;
    isSplashing = false;
    audioPath = AudioHub.ITEMS;
    offset = {
        top: 10,
        right: 15,
        bottom: 10,
        left: 15,
    };

    constructor(x, y, _otherDirection) {
        super().loadImage(this.imgPath.rotation[0]);
        this.loadImages(this.imgPath.rotation);
        this.loadImages(this.imgPath.splash);
        this.x = x;
        this.y = y;
        this.otherDirection = _otherDirection;
        this.width = 50;
        this.height = 60;
        this.throw();
        this.getRealFrame();
    }

    throw() {
        this.speedY = 30;
        IntervalHub.startInterval(this.applyGravity, 1000 / 25);
        IntervalHub.startInterval(this.flyingBottle, 1000 / 40);
        IntervalHub.startInterval(this.animateThrowObj, 1000 / 10);
        // IntervalHub.startInterval(this.itemSound, 1000 / 60);
    }

    flyingBottle = () => {
        if (this.isDead()) {
            return; // Flasche bewegt sich nicht mehr auf x-Achse
        } else if (this.y >= 360) {
            this.stopFalling();
            this.y = 360;
            this.keepFalling = false;
            this.hit(100);
            this.splash();
        }
        if (this.otherDirection === false) {
            this.x += 10;
        } else if (this.otherDirection === true) {
            this.x -= 10;
        }
    };

    stopFalling() {
        this.keepFalling = false;
        this.speedY = 0;
    }

    splash() {
        this.isSplashing = true; // Energie ist 0, Obj ist dead()
        setTimeout(() => {
            this.removeBottle = true; // Flasche soll nach Animation entfernt werden
        }, 1000 / 1.5);
    }

    // Sounds gemanaged über toggle-methode in MovableObj -> dafür Path übergeben mit Bedingung
    itemSound = () => {
        const audio = this.audioPath;
        this.playSound(audio.splash, this.isSplashing);
    };

    animateThrowObj = () => {
        if (this.isSplashing) {
            this.playAnimation(this.imgPath.splash, 0); //splash animation
        } else {
            this.playAnimation(this.imgPath.rotation, 0);
        } //splash animation, muss am Ende stehen, damit die Flasche sich immer dreht, wenn nichts anderes zutrifft (sonst immer nur rotation)
    };
}
