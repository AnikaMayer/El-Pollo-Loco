class MovableObject {
    x = 120;
    y = 250;
    width = 100;
    height = 150;
    img;

    loadImage(_path) {
        this.img = new Image();
        this.img.src = _path;
    }

    moveRight() {}

    moveLeft() {}
}
