import { DrawableObject } from "./drawable-object.class.js";
import { ImageHub } from "./img-hub.class.js";

export class StatusBar extends DrawableObject {
    imgPath = ImageHub.STATUSBAR;
    percentage = 100;

    constructor() {
        super();
        this.x = 40;
        this.y = 0;
        this.width = 200;
        this.height = 60;
    }

    // z.B.: setPercentage(50);
    setPercentage(_percentage, _statPath) {
        this.percentage = _percentage; // => Zahl zwichen 0 und 5 ermitteln
        let path = _statPath[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    // Bilder der Statusbar werden aktualisiert je nachdem, wieviel Energie vorhanden
    resolveImageIndex() {
        if (this.percentage === 100) {
            return 5;
        } else if (this.percentage >= 80) {
            return 4;
        } else if (this.percentage >= 60) {
            return 3;
        } else if (this.percentage >= 40) {
            return 2;
        } else if (this.percentage >= 20) {
            return 1;
        } else {
            return 0;
        }
    }
}
