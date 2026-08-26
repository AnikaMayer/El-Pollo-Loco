export class DrawableObject {
    x = 120;
    y = 280;
    width = 100;
    height = 150;
    img;
    imageCache = {};
    currentImage = 0;
    showFrame = false;
    offset = {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
    };

    // einzelnes Bild laden
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    // mehrere Bilder laden
    loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    // Rahmen für Objekte
    drawFrame(ctx) {
        if (this.showFrame) {
            ctx.beginPath();
            ctx.lineWidth = "5";
            ctx.strokeStyle = "blue";
            ctx.rect(
                this.x + this.offset.left,
                this.y + this.offset.top,
                this.width - this.offset.left - this.offset.right,
                this.height - this.offset.top - this.offset.bottom,
            );
            ctx.stroke();
        }
    }
}
