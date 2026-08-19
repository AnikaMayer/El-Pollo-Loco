class Chicken extends MovableObject {
    y = 360;
    width = 80;
    height = 60;
    imgPath = ImageHub.CHICKEN;

    constructor() {
        super().loadImage(this.imgPath.walk[0]);
        this.loadImages(this.imgPath.walk);

        this.x = 200 + Math.random() * 500;
        this.speed = 0.15 + Math.random() * 0.5;
        this.animate();
    }

    animate() {
        this.moveLeft();

        setInterval(() => {
            //walk animation
            this.playAnimation(this.imgPath.walk);
        }, 200);
    }
}
