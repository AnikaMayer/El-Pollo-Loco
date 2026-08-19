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
            let i = this.currentImage % this.imgPath.walk.length;
            //i = 0 % 6 => 0, Rest 0 | i = 5 % 6 => 0, Rest 5 | i = 6 % 6 => 1, Rest 0 | i = 7 % 6 => 1, Rest 1
            // i = 0, 1, 2, 3, 4, 5, 6, 0, 1, 2, 3, 4, 5, 6, 0, 1, 2, 3, 4, 5, 6, 0....
            let path = this.imgPath.walk[i];
            this.img = this.imageCache[path];
            this.currentImage++;
        }, 200);
    }
}
