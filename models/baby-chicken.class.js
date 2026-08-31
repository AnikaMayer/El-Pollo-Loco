import { AudioHub } from "../scripts/audio-hub.class.js";
import { ImageHub } from "../scripts/img-hub.class.js";
import { IntervalHub } from "../scripts/intervall-hub.class.js";
import { MovableObject } from "./movable-object.class.js";

export class BabyChicken extends MovableObject {
    y = 370;
    width = 50;
    height = 50;
    energy = 50;
    imgPath = ImageHub.BABYCHICKEN;
    audioPath = AudioHub.ENEMIES.deadBabyChicken;
    showFrame = true;
    offset = {
        top: 10,
        right: 10,
        bottom: 7,
        left: 10,
    };

    constructor() {
        super().loadImage(this.imgPath.walk[0]);
        this.loadImages(this.imgPath.walk);
        this.loadImages(this.imgPath.dead);

        this.x = 300 + Math.random() * 1800;
        this.speed = 0.15 + Math.random() * 0.5;
        IntervalHub.startInterval(this.moveBabyChicken, 1000 / 60);
        IntervalHub.startInterval(this.animateBabyChicken, 1000 / 5);
        // IntervalHub.startInterval(this.babyChickenSound, 1000 / 60);
        this.getRealFrame();
    }

    moveBabyChicken = () => {
        this.moveLeft();
    };

    // Sounds gemanaged über toggle-methode in MovableObj -> dafür Path übergeben mit Bedingung
    babyChickenSound = () => {
        const audio = this.audioPath;
        this.playSound(audio, this.isDead());
    };

    animateBabyChicken = () => {
        if (this.isDead()) {
            // wenn isDead() zurückgegeben aus movableObj
            this.playAnimation(this.imgPath.dead); // dead-animation
        } else {
            this.playAnimation(this.imgPath.walk); //walk animation
        }
    };
}
