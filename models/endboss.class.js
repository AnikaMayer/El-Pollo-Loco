import { AudioHub } from "../scripts/audio-hub.class.js";
import { ImageHub } from "../scripts/img-hub.class.js";
import { IntervalHub } from "../scripts/intervall-hub.class.js";
import { MovableObject } from "./movable-object.class.js";

export class Endboss extends MovableObject {
    y = 55;
    width = 250;
    height = 400;
    speed = 0.6;
    baseSpeed = this.speed;
    imgPath = ImageHub.BOSS;
    audioPath = AudioHub.ENEMIES.EndbossApproach;
    encounter = false;
    movingLeft = true;
    // showFrame = true;
    timepassed = new Date().getTime();
    state = "walk";
    offset = {
        top: 160,
        right: 40,
        bottom: 25,
        left: 50,
    };

    constructor() {
        super().loadImage(this.imgPath.alert[0]);
        this.loadImages(this.imgPath.walk);
        this.loadImages(this.imgPath.alert);
        this.loadImages(this.imgPath.dead);
        this.loadImages(this.imgPath.hurt);
        this.loadImages(this.imgPath.attack);
        this.x = 3490;
        // this.x = 400;
        IntervalHub.startInterval(this.moveEndboss, 1000 / 60);
        IntervalHub.startInterval(this.animate, 1000 / 5);
        IntervalHub.startInterval(this.endbossSound, 1000 / 60);
        this.getRealFrame();
    }

    // sobald Begegnung ausgelöst, bewegt sich Boss nach links/ rechts, aber nicht außerhalb der Map
    moveEndboss = () => {
        if (this.encounter === true) {
            this.moveToCharacter();
            if (this.movingLeft) {
                this.moveLeft();
                this.otherDirection = false;
            } else {
                this.moveRight();
                this.otherDirection = true;
            }
            this.stopAtMapEnd();
        }
    };

    // Endboss bewegt sich immer auf CHarakter zu
    moveToCharacter() {
        if (this.x >= this.world.character.x) {
            this.movingLeft = true;
        } else if (this.x < this.world.character.x) {
            this.movingLeft = false;
        }
    }

    //dreht am Ende wieder um
    stopAtMapEnd() {
        if (this.x <= 120 && this.movingLeft) {
            this.movingLeft = false;
        } else if (this.x >= 3500 && !this.movingLeft) {
            this.movingLeft = true;
        }
    }

    // Sounds gemanaged über toggle-methode in MovableObj -> dafür Path übergeben mit Bedingung
    endbossSound = () => {
        const audio = this.audioPath;
        this.playSound(audio, this.state === "alert" && !this.isDead());
    };

    // animation für endboss
    animate = () => {
        if (this.isDead()) {
            // wenn isDead() zurückgegeben aus movableObj
            this.playAnimation(this.imgPath.dead, 0);
        } else if (this.isHurt()) {
            this.playAnimation(this.imgPath.hurt, 0);
        } else {
            this.animateBossMovement();
        }
    };

    // animations-ablauf für walking, alert, attack
    animateBossMovement() {
        const newTime = new Date().getTime(); // wird aktualisiert, nachdem Zeit jedes States vergangen
        const timing = this.getTiming(); // timing wird in Methode definiert
        if (this.state === "walk") {
            this.playAnimation(this.imgPath.walk, 0);
        } else if (this.state === "alert") {
            this.playAnimation(this.imgPath.alert, 0);
        } else {
            this.playAnimation(this.imgPath.attack, 0);
        }
        this.checkTimePassed(newTime, timing); // prüfen, wieviel Zeit vergangen, wann Wechsel
    }

    // definiert, wie lange die einzelnen Animation abgespielt werden
    getTiming() {
        if (this.state === "walk") {
            return 4000;
        } else if (this.state === "alert") {
            return 2000;
        } else {
            return 3000;
        }
    }

    // wenn Zeit abgelaufen: je nach state wird Speed neu oder zurückgesetzt, nächster state wird aufgerufen
    checkTimePassed(newTime, timing) {
        if (this.encounter === true && newTime - this.timepassed > timing) {
            if (this.state === "walk") {
                this.speed = 0;
                this.state = "alert";
            } else if (this.state === "alert") {
                this.speed = 0;
                this.state = "attack";
            } else {
                this.speed = this.baseSpeed;
                this.state = "walk";
            }
            this.timepassed = new Date().getTime();
        }
    }
}
