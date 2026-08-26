import { DrawableObject } from "./drawable-object.class.js";
import { ImageHub } from "./img-hub.class.js";

export class StatusCounter extends DrawableObject {
    imgPath = ImageHub.STATUSBAR;
    count = 0;

    constructor() {
        super();
        this.width = 60;
        this.height = 60;
    }

    // count = Anzahl der Flaschen/ Münzen, wird hier aktualisiert
    setCount(newCount) {
        this.count = newCount;
    }

    // aktuelle count wird gezeichnet/ sichtbar gemacht
    drawCount(ctx) {
        ctx.font = "28px Alfa Slab One";
        ctx.fillStyle = "white";
        ctx.fillText(
            this.count,
            this.x + this.width,
            this.y + this.height * 0.7,
        );
    }
}
