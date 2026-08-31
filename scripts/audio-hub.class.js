class Sound {
    file;
    isLoaded;
    isPlaying;

    constructor(_file) {
        this.file = new Audio(_file);
    }
}

export class AudioHub {
    static CHARACTER = {
        walk: new Sound("./assets/sounds/character/characterRun.mp3"),
        jump: new Sound("./assets/sounds/character/characterJump.wav"),
        damage: new Sound("./assets/sounds/character/characterDamage.mp3"),
        dead: new Sound("./assets/sounds/character/characterDead.wav"),
        snoring: new Sound("./assets/sounds/character/characterSnoring.mp3"),
    };

    static ENEMIES = {
        deadChicken: new Sound("./assets/sounds/chicken/chickenDead2.mp3"),
        deadBabyChicken: new Sound("./assets/sounds/chicken/chickenDead.mp3"),
        EndbossApproach: new Sound(
            "./assets/sounds/endboss/endbossApproach.wav",
        ),
    };

    static ITEMS = {
        bottle: new Sound(
            "./assets/sounds/collectibles/bottleCollectSound.wav",
        ),
        coin: new Sound("./assets/sounds/collectibles/collectSound.wav"),
        splash: new Sound("./assets/sounds/throwable/bottleBreak.mp3"),
    };

    static GAME = {
        start: new Sound("./assets/sounds/game/gameStart.mp3"),
    };

    static allSounds = [
        AudioHub.CHARACTER,
        AudioHub.ENEMIES,
        AudioHub.ITEMS,
        AudioHub.GAME,
    ];

    static playOne(sound) {
        sound.file.volume = 0.2;

        if (sound.isPlaying === true) {
            return;
        } else if (sound.file.readyState === 4 || sound.isLoaded) {
            sound.file.currentTime = 0;
            sound.isLoaded = true;
            sound.file.play();
            sound.isPlaying = true;
        }
    }

    static stopAll() {
        AudioHub.allSounds.forEach((sound) => {
            sound.file.pause();
            sound.isPlaying = false;
        });
    }

    static stopOne(sound) {
        sound.file.pause();
        sound.isPlaying = false;
    }
}
