import { AudioHub } from "../scripts/audio-hub.class.js";
import { ImageHub } from "../scripts/img-hub.class.js";
import { IntervalHub } from "../scripts/intervall-hub.class.js";
import { DrawableObject } from "./drawable-object.class.js";

export class Endscreen extends DrawableObject {
    x = 160;
    y = 100;
    width = 400;
    height = 240;
    imgPath = ImageHub.ENDSCREEN;
    state = "win";
    // audioPath = AudioHub.;

    constructor() {
        super().loadImage(this.imgPath.win);
        this.loadImage(this.imgPath.lose);
    }

    setState(value) {
        this.state = value;
        if (value === "win") {
            this.loadImage(this.imgPath.win);
        } else if (value === "lose") {
            this.loadImage(this.imgPath.lose);
        }
    }
}
