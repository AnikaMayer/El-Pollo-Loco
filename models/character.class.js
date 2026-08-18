class Character extends MovableObject {
    imgPath = ImageHub.PEPE;

    constructor() {
        super().loadImage(this.imgPath.walk[0]);
    }

    jump() {}
}
