class Cloud extends MovableObject {
    y = 20;
    width = 500;
    height = 250;
    imgPath = ImageHub.BACKGROUND.clouds;

    constructor() {
        super().loadImage(this.imgPath[0]);

        this.x = Math.random() * 500; //zufällig generierte Zahl zwischen 0 und 500
        this.animate();
    }

    animate() {
        this.moveLeft();
    }
}
