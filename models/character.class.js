class Character extends MovableObject {
    y = 155;
    height = 280;
    imgPath = ImageHub.PEPE;

    constructor() {
        super().loadImage(this.imgPath.walk[0]);
        this.loadImages(this.imgPath.walk);
        this.animate();
    }

    animate() {
        setInterval(() => {
            let i = this.currentImage % this.imgPath.walk.length;
            //i = 0 % 6 => 0, Rest 0 | i = 5 % 6 => 0, Rest 5 | i = 6 % 6 => 1, Rest 0 | i = 7 % 6 => 1, Rest 1
            // i = 0, 1, 2, 3, 4, 5, 6, 0, 1, 2, 3, 4, 5, 6, 0, 1, 2, 3, 4, 5, 6, 0....
            let path = this.imgPath.walk[i];
            this.img = this.imageCache[path];
            this.currentImage++;
        }, 100);
    }

    jump() {}
}
