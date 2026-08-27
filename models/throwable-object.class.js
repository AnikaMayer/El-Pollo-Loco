import { ImageHub } from "../scripts/img-hub.class.js";
import { IntervalHub } from "./intervall-hub.class.js";
import { MovableObject } from "./movable-object.class.js";

export class ThrowableObject extends MovableObject {
    imgPath = ImageHub.BOTTLE;
    keepFalling = true;
    showFrame = true;
    offset = {
        top: 10,
        right: 15,
        bottom: 10,
        left: 15,
    };

    constructor(x, y) {
        super().loadImage(this.imgPath.rotation[0]);
        this.loadImages(this.imgPath.rotation);
        this.loadImages(this.imgPath.splash);
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 60;
        this.throw();
    }

    throw() {
        this.speedY = 30;
        IntervalHub.startInterval(this.applyGravity, 1000 / 25);
        IntervalHub.startInterval(this.flyingBottle, 1000 / 40);
        IntervalHub.startInterval(this.animateThrowObj, 1000 / 10);
        this.getRealFrame();
    }

    flyingBottle = () => {
        if (this.isDead()) {
            return; // Flasche bewegt sich nicht mehr auf x-Achse
        } else if (this.y >= 360) {
            this.keepFalling = false;
            this.splash();
        }
        this.x += 10;
    };

    splash() {
        this.energy = 0; // Energie ist 0, Obj ist dead()
        setTimeout(() => {
            this.removeBottle = true; // Flasche soll nach Animation entfernt werden
        }, 1000 / 1.5);
    }

    animateThrowObj = () => {
        if (this.isDead()) {
            this.playAnimation(this.imgPath.splash); //splash animation
        } else {
            this.playAnimation(this.imgPath.rotation);
        } //splash animation, muss am Ende stehen, damit die Flasche sich immer dreht, wenn nichts anderes zutrifft (sonst immer nur rotation)
    };
}
