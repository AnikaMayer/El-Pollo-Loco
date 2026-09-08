/**
 * Tracks the current input state for both keyboard and touch controls.
 * Keyboard keys are updated in game.js via keydown/keyup listeners.
 * Touch buttons are registered directly in this class.
 */
export class Keyboard {
    /** @type {boolean} Whether the left arrow key or left touch button is currently pressed. */
    LEFT = false;
    /** @type {boolean} Whether the right arrow key or right touch button is currently pressed. */
    RIGHT = false;
    /** @type {boolean} Whether the up arrow key is currently pressed. */
    UP = false;
    /** @type {boolean} Whether the down arrow key is currently pressed. */
    DOWN = false;
    /** @type {boolean} Whether the space key or jump touch button is currently pressed. */
    SPACE = false;
    /** @type {boolean} Whether the D key or throw touch button is currently pressed. */
    D = false;
    /**
     * Maps touch button element IDs to their corresponding keyboard state keys.
     * @type {{ id: string, key: string }[]}
     */
    touchBtns = [
        { id: "btnLeft", key: "LEFT" },
        { id: "btnRight", key: "RIGHT" },
        { id: "btnJump", key: "SPACE" },
        { id: "btnThrow", key: "D" },
    ];

    /**
     * Creates a new Keyboard instance and registers all touch controls.
     */
    constructor() {
        this.touchControls();
    }

    /**
     * Registers touchstart and touchend listeners for each touch button.
     */
    touchControls() {
        this.touchBtns.forEach(({ id, key }) => {
            const btn = document.getElementById(id);
            this.touchStart(key, btn);
            this.touchEnd(key, btn);
        });
    }

    /**
     * Registers a touchstart listener on a button that sets the given key state to true.
     * Uses passive: false to allow preventDefault and suppress unwanted scroll behavior.
     * @param {string} key - The keyboard state property to set (e.g. 'LEFT', 'SPACE').
     * @param {HTMLElement} btn - The touch button element to listen on.
     */
    touchStart(key, btn) {
        btn.addEventListener(
            "touchstart",
            (e) => {
                e.preventDefault();
                this[key] = true;
            },
            { passive: false },
        );
    }

    /**
     * Registers a touchend listener on a button that sets the given key state to false.
     * Uses passive: false to allow preventDefault and suppress unwanted scroll behavior.
     * @param {string} key - The keyboard state property to reset (e.g. 'LEFT', 'SPACE').
     * @param {HTMLElement} btn - The touch button element to listen on.
     */
    touchEnd(key, btn) {
        btn.addEventListener(
            "touchend",
            (e) => {
                e.preventDefault();
                this[key] = false;
            },
            { passive: false },
        );
    }
}
