import { AudioHub } from "../scripts/audio-hub.class.js";
import { ImageHub } from "../scripts/img-hub.class.js";
import { IntervalHub } from "../scripts/intervall-hub.class.js";
import { MovableObject } from "./movable-object.class.js";

export class Endboss extends MovableObject {
    y = 55;
    width = 250;
    height = 400;
    // energy = 200;
    imgPath = ImageHub.BOSS;
    ausdioPath = AudioHub.ENEMIES.deadEndBoss;
    encounter = false;
    showFrame = true;
    offset = {
        top: 160,
        right: 40,
        bottom: 25,
        left: 50,
    };

    constructor() {
        super().loadImage(this.imgPath.alert[0]);
        this.loadImages(this.imgPath.alert);
        this.loadImages(this.imgPath.dead);
        this.loadImages(this.imgPath.hurt);
        this.x = 2500;
        IntervalHub.startInterval(this.moveEndboss, 1000 / 60);
        IntervalHub.startInterval(this.animate, 1000 / 5);
        // IntervalHub.startInterval(this.chickenSound, 1000 / 60);
        this.getRealFrame();
    }

    moveEndboss = () => {
        if (this.encounter === true) {
            this.moveLeft();
        }
    };

    // Sounds gemanaged über toggle-methode in MovableObj -> dafür Path übergeben mit Bedingung
    endbossSound = () => {
        const audio = this.audioPath;
        this.playSound(audio, this.isDead());
    };

    animate = () => {
        if (this.isDead()) {
            // wenn isDead() zurückgegeben aus movableObj
            this.playAnimation(this.imgPath.dead);
        } else if (this.isHurt()) {
            this.playAnimation(this.imgPath.hurt);
        } else {
            //alert animation
            this.playAnimation(this.imgPath.alert);
        }
    };
}
