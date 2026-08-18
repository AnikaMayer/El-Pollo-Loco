class Character extends MovableObject {
    height = 280;
    y = 155;
    imgPath = ImageHub.PEPE;

    constructor() {
        super().loadImage(this.imgPath.walk[0]);
    }

    jump() {}
}
