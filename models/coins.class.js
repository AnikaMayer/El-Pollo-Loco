import { ImageHub } from "../scripts/img-hub.class.js";
import { IntervalHub } from "../scripts/intervall-hub.class.js";
import { MovableObject } from "./movable-object.class.js";

export class Coin extends MovableObject {
    x;
    y;
    width = 140;
    height = 140;
    imgPath = ImageHub.COIN;
    // showFrame = true;
    offset = {
        top: 50,
        right: 50,
        bottom: 50,
        left: 50,
    };

    constructor(_x, _y) {
        super().loadImage(this.imgPath[0]);
        this.loadImages(this.imgPath);
        IntervalHub.startInterval(this.animateCoin, 1000 / 2.5);
        this.x = _x;
        this.y = _y;
        this.getRealFrame();
    }

    animateCoin = () => {
        this.playAnimation(this.imgPath);
    };

    // Vorlage für Münzbogen, Array mit Münzen wird erstellt, Münzen entsprechend unterschieldich angeordnet
    static arcPattern(baseX, baseY) {
        const coins = [];
        const coin1 = new Coin(baseX, baseY);
        const coin2 = new Coin(baseX + 110, baseY - 75);
        const coin3 = new Coin(baseX + 220, baseY - 150);
        const coin4 = new Coin(baseX + 330, baseY - 75);
        const coin5 = new Coin(baseX + 440, baseY);
        coins.push(coin1, coin2, coin3, coin4, coin5);
        return coins;
    }

    // Münzvorlage für horizontale Linie
    static horizontalLinePattern(baseX, y) {
        const coins = [];
        const coin1 = new Coin(baseX, y);
        const coin2 = new Coin(baseX + 50, y);
        const coin3 = new Coin(baseX + 100, y);
        const coin4 = new Coin(baseX + 150, y);
        const coin5 = new Coin(baseX + 200, y);
        coins.push(coin1, coin2, coin3, coin4, coin5);
        return coins;
    }

    // Münzvorlage für vertikale Linie
    static verticalLinePattern(x, baseY) {
        const coins = [];
        const coin1 = new Coin(x, baseY);
        const coin2 = new Coin(x, baseY - 50);
        const coin3 = new Coin(x, baseY - 100);
        coins.push(coin1, coin2, coin3);
        return coins;
    }

    // Münzvorlage für Diagonale
    static diagonalPattern(baseX, baseY) {
        const coins = [];
        const coin1 = new Coin(baseX, baseY);
        const coin2 = new Coin(baseX + 50, baseY - 25);
        const coin3 = new Coin(baseX + 100, baseY - 50);
        const coin4 = new Coin(baseX + 150, baseY - 75);
        const coin5 = new Coin(baseX + 200, baseY - 100);
        coins.push(coin1, coin2, coin3, coin4, coin5);
        return coins;
    }
}
