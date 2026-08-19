class Character extends MovableObject {
    y = 155;
    height = 280;
    speed = 10;
    imgPath = ImageHub.PEPE;
    world;

    constructor() {
        super().loadImage(this.imgPath.walk[0]);
        this.loadImages(this.imgPath.walk);
        this.animate();
    }

    animate() {
        setInterval(() => {
            if (this.world.keyboard.RIGHT) {
                this.x += this.speed;
                this.otherDirection = false;
            }
            if (this.world.keyboard.LEFT) {
                this.x -= this.speed;
                this.otherDirection = true;
            }
            this.world.camera_x = -this.x; //Map wird gegenteilig zum Character verschoben
        }, 1000 / 60);

        setInterval(() => {
            if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
                this.x += this.speed;
                //walk animation
                let i = this.currentImage % this.imgPath.walk.length; //i = 0 % 6 => 0, Rest 0 | 5 % 6 => 0, R 5 | 6 % 6 => 1, R 0 | 7 % 6 => 1, R 1
                let path = this.imgPath.walk[i]; // i = 0, 1, 2, 3, 4, 5, 6, 0, 1, 2, 3, 4, 5, 6, 0, 1, 2, 3, 4, 5, 6, 0 usw....
                this.img = this.imageCache[path];
                this.currentImage++;
            }
        }, 50);
    }

    jump() {}
}
