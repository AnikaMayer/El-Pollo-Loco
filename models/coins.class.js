import { CollectableObject } from "./collectable-object.class.js";
import { ImageHub } from "./img-hub.class.js";
import { IntervalHub } from "./intervall-hub.class.js";

export class Coin extends CollectableObject {
    x;
    y;
    width = 140;
    height = 140;
    imgPath = ImageHub.COIN;
    showFrame = true;
    offset = {
        top: 50,
        right: 50,
        bottom: 50,
        left: 50,
    };

    constructor(_x, _y) {
        super().loadImage(this.imgPath[0]);
        this.loadImages(this.imgPath);
        IntervalHub.startInterval(this.animateCoin, 400);
        this.x = _x;
        this.y = _y;
        this.getRealFrame();
    }

    animateCoin = () => {
        this.playAnimation(this.imgPath);
    };

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

    static verticalLinePattern(x, baseY) {
        const coins = [];
        const coin1 = new Coin(x, baseY);
        const coin2 = new Coin(x, baseY - 50);
        const coin3 = new Coin(x, baseY - 100);
        coins.push(coin1, coin2, coin3);
        return coins;
    }

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
