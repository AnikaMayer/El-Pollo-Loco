import { ImageHub } from "./img-hub.class.js";
import { MovableObject } from "./movable-object.class.js";

export class Character extends MovableObject {
    y = 80;
    height = 250;
    speed = 10;
    imgPath = ImageHub.PEPE;
    world;

    constructor() {
        super().loadImage(this.imgPath.walk[0]);
        this.loadImages(this.imgPath.walk);
        this.applyGravity();
        this.animate();
    }

    animate() {
        setInterval(() => {
            if (
                this.world.keyboard.RIGHT &&
                this.x < this.world.level.level_end_x
            ) {
                this.x += this.speed;
                this.otherDirection = false;
            }
            if (this.world.keyboard.LEFT && this.x > 0) {
                this.x -= this.speed;
                this.otherDirection = true;
            }
            this.world.camera_x = -this.x + 100; //Map wird gegenteilig zum Character verschoben
        }, 1000 / 60);

        setInterval(() => {
            if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
                //walk animation
                this.playAnimation(this.imgPath.walk);
            }
        }, 50);
    }

    jump() {}
}
