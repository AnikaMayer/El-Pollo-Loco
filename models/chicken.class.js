class Chicken extends MovableObject {
    imgPath = ImageHub.CHICKEN;

    constructor() {
        super().loadImage(this.imgPath.walk[0]);

        this.x = 200 + Math.random() * 500;
    }
}
