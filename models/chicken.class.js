class Chicken extends MovableObject {
    height = 60;
    width = 80;
    y = 360;
    imgPath = ImageHub.CHICKEN;

    constructor() {
        super().loadImage(this.imgPath.walk[0]);

        this.x = 200 + Math.random() * 500;
    }
}
