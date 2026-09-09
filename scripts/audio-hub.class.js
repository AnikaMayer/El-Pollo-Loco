/**
 * Represents a single audio file with playback state and configuration.
 */
class Sound {
    /** @type {HTMLAudioElement} The underlying audio element. */
    file;
    /** @type {boolean} Whether the audio file has been fully loaded and is ready to play. */
    isLoaded;
    /** @type {boolean} Whether the sound is currently playing. */
    isPlaying = false;
    /** @type {boolean} Whether the sound is muted. */
    muted = false;

    /**
     * Creates a new Sound instance.
     * - Loop sounds play continuously (e.g. snoring, background music).
     * - playOnce sounds always restart from the beginning on each play call (e.g. coin collect).
     * - Normal sounds use the soundPlayed property in MovableObject to control playback.
     * @param {string} _file - The path to the audio file.
     * @param {boolean} [_loop=false] - Whether the sound should loop continuously.
     * @param {boolean} [_playOnce=false] - Whether the sound should always restart on play.
     */
    constructor(_file, _loop = false, _playOnce = false) {
        this.file = new Audio(_file);
        this.file.loop = _loop;
        this.playOnce = _playOnce;
    }
}

/**
 * Central static audio manager for the game.
 * Holds all Sound instances organized by category and provides
 * methods to play, stop, mute and unmute sounds.
 */
export class AudioHub {
    /**
     * Sound effects for the player character.
     * @type {{ walk: Sound, jump: Sound, bounce: Sound, damage: Sound, dead: Sound, snoring: Sound }}
     */
    static CHARACTER = {
        walk: new Sound("./assets/sounds/character/characterRun.mp3"),
        jump: new Sound("./assets/sounds/character/characterJump.wav", true),
        bounce: new Sound(
            "./assets/sounds/character/characterBounce.mp3",
            false,
            true,
        ),
        damage: new Sound("./assets/sounds/character/characterDamage.mp3"),
        dead: new Sound("./assets/sounds/character/characterDead.wav"),
        snoring: new Sound("./assets/sounds/character/characterSnoring.mp3"),
    };

    /**
     * Sound effects for enemies.
     * @type {{ deadChicken: Sound, deadBabyChicken: Sound, bossApproach: Sound, bossDead: Sound }}
     */
    static ENEMIES = {
        deadChicken: new Sound("./assets/sounds/chicken/chickenDead2.mp3"),
        deadBabyChicken: new Sound("./assets/sounds/chicken/chickenDead.mp3"),
        bossApproach: new Sound("./assets/sounds/endboss/endbossApproach.wav"),
        bossDead: new Sound("./assets/sounds/endboss/chickenBossDead.mp3"),
    };

    /**
     * Sound effects for collectible items and throwable objects.
     * @type {{ bottle: Sound, coin: Sound, splash: Sound }}
     */
    static ITEMS = {
        bottle: new Sound(
            "./assets/sounds/collectibles/bottleCollectSound.wav",
        ),
        coin: new Sound(
            "./assets/sounds/collectibles/collectSound.wav",
            false,
            true,
        ),
        splash: new Sound(
            "./assets/sounds/throwable/bottleBreak.mp3",
            false,
            true,
        ),
    };

    /**
     * Sound effects and music for game states.
     * @type {{ start: Sound, bgm: Sound, main: Sound, win: Sound, gameOver: Sound }}
     */
    static GAME = {
        start: new Sound("./assets/sounds/game/gameStart.mp3", false, true),
        bgm: new Sound("./assets/sounds/game/bgmMusic.mp3", true),
        main: new Sound("./assets/sounds/game/mainTitle.mp3", true),
        win: new Sound("./assets/sounds/game/game-won.mp3"),
        gameOver: new Sound("./assets/sounds/game/game-over.mp3"),
    };

    /**
     * All sound category objects, used for bulk operations like mute and unmute.
     * @type {Object[]}
     */
    static allSounds = [
        AudioHub.CHARACTER,
        AudioHub.ENEMIES,
        AudioHub.ITEMS,
        AudioHub.GAME,
    ];

    /**
     * Plays a sound if it is not already playing.
     * playOnce sounds always restart from the beginning.
     * Resets the playback position to the start on each call.
     * @param {Sound} sound - The sound to play.
     */
    static playOne(sound) {
        if (sound.isPlaying && !sound.playOnce) {
            return;
        }
        sound.file.volume = 0.2;
        sound.file.muted = sound.muted;
        if (sound.file.readyState > 0 || sound.isLoaded) {
            sound.isLoaded = true;
            sound.isPlaying = true;
            sound.file.currentTime = 0;
            sound.file.play();
            sound.file.onended = () => {
                sound.isPlaying = false;
            };
        }
    }

    /**
     * Mutes all sounds across all categories by setting their volume to 0.
     */
    static muteAll() {
        AudioHub.allSounds.forEach((array) => {
            Object.values(array).forEach((sound) => {
                sound.muted = true;
                sound.file.muted = true;
            });
        });
    }

    /**
     * Unmutes all sounds across all categories by restoring their volume to 0.2.
     */
    static unmuteAll() {
        AudioHub.allSounds.forEach((array) => {
            Object.values(array).forEach((sound) => {
                sound.muted = false;
                sound.file.muted = false;
            });
        });
    }

    /**
     * Stops all sounds across all categories immediately.
     */
    static stopAll() {
        AudioHub.allSounds.forEach((sound) => {
            sound.file.pause();
            sound.isPlaying = false;
        });
    }

    /**
     * Stops a single sound if it is currently playing.
     * @param {Sound} sound - The sound to stop.
     */
    static stopOne(sound) {
        if (!sound.isPlaying) {
            return;
        }
        sound.isPlaying = false;
        sound.file.pause();
    }
}
