class MovableObject {
    x = 120;
    y = 280;
    width = 100;
    height = 150;
    img;
    imageCache = {};
    currentImage = 0;
    speed = 0.15;
    otherDirection = false;

    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    playAnimation(images) {
        let i = this.currentImage % images.length; //i = 0 % 6 => 0, Rest 0 | 5 % 6 => 0, R 5 | 6 % 6 => 1, R 0 | 7 % 6 => 1, R 1
        let path = images[i]; // i = 0, 1, 2, 3, 4, 5, 6, 0, 1, 2, 3, 4, 5, 6, 0, 1, 2, 3, 4, 5, 6, 0 usw....
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    moveRight() {}

    moveLeft() {
        setInterval(() => {
            this.x -= this.speed;
        }, 1000 / 60);
    }
}
