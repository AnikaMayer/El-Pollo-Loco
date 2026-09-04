class Sound {
    file;
    isLoaded;
    isPlaying = false;

    constructor(_file, _loop = false) {
        this.file = new Audio(_file);
        this.file.loop = _loop;
    }
}

export class AudioHub {
    static CHARACTER = {
        walk: new Sound("./assets/sounds/character/characterRun.mp3"),
        jump: new Sound("./assets/sounds/character/characterJump.wav", true),
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
        if (sound.isPlaying) {
            return;
        }
        sound.file.volume = 0.2;

        if (sound.file.readyState === 4 || sound.isLoaded) {
            sound.isLoaded = true;
            sound.isPlaying = true;
            sound.file.currentTime = 0;
            sound.file.play();
            console.log("play() called");
            sound.file.onended = () => {
                sound.isPlaying = false;
            };
        }
    }

    static stopAll() {
        AudioHub.allSounds.forEach((sound) => {
            sound.file.pause();
        });
    }

    static stopOne(sound) {
        if (!sound.isPlaying) {
            return;
        }
        sound.isPlaying = false;
        sound.file.pause();
        sound.file.currentTime = 0;
    }
}
