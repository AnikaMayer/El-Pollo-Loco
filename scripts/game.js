import { Keyboard } from "./keyboard.class.js";
import { World } from "../models/world.class.js";
import { IntervalHub } from "./intervall-hub.class.js";
import { AudioHub } from "./audio-hub.class.js";
import { initLevel } from "../levels/level1.js";

/** @type {HTMLButtonElement} Button to start the game. */
const startButton = document.getElementById("start-btn");
/** @type {HTMLButtonElement} Button to open the controls dialog. */
const controlButton = document.getElementById("control-btn");
/** @type {HTMLButtonElement} Button to open the imprint dialog. */
const imprintButton = document.getElementById("imprint-btn");
/** @type {HTMLButtonElement} Button to close the controls dialog. */
const closeButtonCntrl = document.getElementById("close-btn-cntrl");
/** @type {HTMLButtonElement} Button to close the imprint dialog. */
const closeButtonImpr = document.getElementById("close-btn-imprint");
/** @type {HTMLButtonElement} Button to return to the home screen. */
const homeButton = document.getElementById("home-btn");
/** @type {HTMLButtonElement} Button to mute all audio. */
const muteButton = document.getElementById("mute-btn");
/** @type {HTMLButtonElement} Button to unmute all audio. */
const unmuteButton = document.getElementById("unmute-btn");
/** @type {HTMLButtonElement} Button to enter fullscreen mode. */
const fullscreenBtn = document.getElementById("fullscrn-btn");
/** @type {HTMLButtonElement} Button to exit fullscreen mode. */
const normScreenBtn = document.getElementById("normscrn-btn");
/** @type {HTMLButtonElement} Button to restart the game. */
const restartBtn = document.getElementById("restart-btn");

/** @type {HTMLElement} The start screen container. */
const startScreen = document.getElementById("startScreen");
/** @type {HTMLElement} The controls page inside the dialog. */
const controlPage = document.getElementById("control-page");
/** @type {HTMLElement} The imprint page inside the dialog. */
const imprintPage = document.getElementById("imprint-page");
/** @type {HTMLElement} The HUD panel shown during gameplay. */
const hudPanel = document.getElementById("hud");
/** @type {HTMLElement} The fullscreen container element. */
const fullscreen = document.getElementById("fullscreen");

/** @type {HTMLDialogElement} The imprint modal dialog. */
const imprintDialog = document.getElementById("imprint_dialog");
/** @type {HTMLDialogElement} The controls modal dialog. */
const controlsDialog = document.getElementById("controls_dialog");

/** @type {HTMLCanvasElement} The game canvas element. */
let canvas;
/** @type {World} The current game world instance. */
let world;
/** @type {Keyboard} The keyboard input state object. */
let keyboard = new Keyboard();
/** @type {boolean} Whether audio is currently muted, persisted via localStorage. */
let isMuted = localStorage.getItem("mutedKey") === "true";

/**
 * Initializes the game on page load.
 * Sets up all click events, applies the stored mute state and starts the main menu music.
 */
function init() {
    manageClickEvents();
    applyMuteState();
    startMusic();
}

//#region manageClick

/**
 * Registers all click event listeners for buttons and dialogs.
 */
function manageClickEvents() {
    interfaceEvents();
    navEvents();
    dialogEvents();
}

/**
 * Registers click events for interface control buttons
 * (home, mute, unmute, fullscreen, normal screen).
 */
function interfaceEvents() {
    homeButton.addEventListener("click", manageInterface);
    muteButton.addEventListener("click", manageInterface);
    unmuteButton.addEventListener("click", manageInterface);
    fullscreenBtn.addEventListener("click", manageInterface);
    normScreenBtn.addEventListener("click", manageInterface);
}

/**
 * Registers click events for navigation buttons
 * (controls, imprint, close dialogs, start, restart).
 */
function navEvents() {
    controlButton.addEventListener("click", manageDialog);
    imprintButton.addEventListener("click", manageDialog);
    closeButtonCntrl.addEventListener("click", manageDialog);
    closeButtonImpr.addEventListener("click", manageDialog);

    startButton.addEventListener("click", manageStart);
    restartBtn.addEventListener("click", manageStart);
}

/**
 * Registers click events for dialog backdrop closing, event bubbling protection
 * and orientation change handling.
 */
function dialogEvents() {
    imprintDialog.addEventListener("click", closeDialog);
    controlsDialog.addEventListener("click", closeDialog);
    controlPage.addEventListener("click", bubblingProtection);
    imprintPage.addEventListener("click", bubblingProtection);
    screen.orientation.addEventListener("change", closeDialog);
}

//#endregion

/**
 * Plays the main menu music on the first click anywhere on the page,
 * unless the start button was clicked directly.
 */
function startMusic() {
    document.addEventListener(
        "click",
        (event) => {
            if (event.target !== startButton) {
                AudioHub.playOne(AudioHub.GAME.main);
            }
        },
        { once: true }, // sorgt dafür, dass event listener nur einmal benötigt wird pro session
    );
}

//#region keyboard

/**
 * Sets the corresponding keyboard state to true when a key is pressed.
 * Supports ArrowRight, ArrowLeft, ArrowUp, ArrowDown, Space and D.
 */
window.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") {
        keyboard.RIGHT = true;
    }
    if (event.key === "ArrowLeft") {
        keyboard.LEFT = true;
    }
    if (event.key === "ArrowUp") {
        keyboard.UP = true;
    }
    if (event.key === "ArrowDown") {
        keyboard.DOWN = true;
    }
    if (event.key === " ") {
        keyboard.SPACE = true;
    }
    if (event.key === "d") {
        keyboard.D = true;
    }
});

/**
 * Sets the corresponding keyboard state to false when a key is released.
 * Supports ArrowRight, ArrowLeft, ArrowUp, ArrowDown, Space and D.
 */
window.addEventListener("keyup", (event) => {
    if (event.key === "ArrowRight") {
        keyboard.RIGHT = false;
    }
    if (event.key === "ArrowLeft") {
        keyboard.LEFT = false;
    }
    if (event.key === "ArrowUp") {
        keyboard.UP = false;
    }
    if (event.key === "ArrowDown") {
        keyboard.DOWN = false;
    }
    if (event.key === " ") {
        keyboard.SPACE = false;
    }
    if (event.key === "d") {
        keyboard.D = false;
    }
});

//#endregion

//#region startGame

/**
 * Handles start and restart button clicks and triggers world rendering.
 * @param {MouseEvent} event - The click event from the button.
 */
function manageStart(event) {
    const clickedBtn = event.currentTarget.id;
    if (clickedBtn === "start-btn" || clickedBtn === "restart-btn") {
        renderWorld();
    }
}

/**
 * Initializes or restarts the game world.
 * Cancels any existing animation frame, reinitializes the level,
 * creates a new World instance and updates the UI accordingly.
 */
function renderWorld() {
    canvas = document.getElementById("canvas");
    if (world) {
        cancelAnimationFrame(world.drawID);
    }
    initLevel();
    world = new World(canvas, keyboard);
    world.onEndScreen = toggleRestartBtn;
    toggleRestartBtn();
    toggleHideWorld();
    worldAudio();
}

/**
 * Manages audio transitions when starting a new game.
 * Stops menu and end screen sounds and plays the start jingle and background music.
 */
function worldAudio() {
    AudioHub.stopOne(AudioHub.GAME.main);
    AudioHub.stopOne(AudioHub.GAME.win);
    AudioHub.stopOne(AudioHub.GAME.gameOver);
    AudioHub.playOne(AudioHub.GAME.start);
    AudioHub.playOne(AudioHub.GAME.bgm);
}

/**
 * Updates the UI visibility when the game starts.
 * Hides the start screen and nav buttons; shows the home button and HUD.
 */
function toggleHideWorld() {
    startScreen.classList.add("hide-page");
    homeButton.classList.remove("hide-btn");
    restartBtn.classList.add("hide-btn");
    controlButton.classList.add("hide-btn");
    imprintButton.classList.add("hide-btn");
    hudPanel.classList.remove("hide-cntrl");
}

/**
 * Toggles the restart button visibility based on whether the game has ended.
 */
function toggleRestartBtn() {
    restartBtn.classList.toggle("hide-btn", world.gameEnd === false);
}

//#endregion

//#region interface

/**
 * Handles all interface button clicks and delegates to the appropriate function.
 * @param {MouseEvent} event - The click event from the interface button.
 */
function manageInterface(event) {
    const clickedBtn = event.currentTarget.id;
    if (clickedBtn === "home-btn") {
        goHome();
    } else if (clickedBtn === "mute-btn") {
        muteAudio();
    } else if (clickedBtn === "unmute-btn") {
        unmuteAudio();
    } else if (clickedBtn === "fullscrn-btn") {
        showFullscreen();
    } else if (clickedBtn === "normscrn-btn") {
        exitFullscreen();
    }
}

/**
 * Stops all game intervals and the animation loop, then returns to the home screen.
 */
function goHome() {
    IntervalHub.stopAllIntervals();
    cancelAnimationFrame(world.drawID);
    toggleHideHome();
    homeAudio();
}

/**
 * Manages audio transitions when returning to the home screen.
 * Stops game sounds and plays the main menu music.
 */
function homeAudio() {
    AudioHub.stopOne(AudioHub.GAME.bgm);
    AudioHub.stopOne(AudioHub.GAME.win);
    AudioHub.stopOne(AudioHub.GAME.gameOver);
    AudioHub.playOne(AudioHub.GAME.main);
}

/**
 * Updates UI visibility when returning to the home screen.
 * Shows the start screen and nav buttons; hides the home button and HUD.
 */
function toggleHideHome() {
    startScreen.classList.remove("hide-page");
    homeButton.classList.add("hide-btn");
    restartBtn.classList.add("hide-btn");
    controlButton.classList.remove("hide-btn");
    imprintButton.classList.remove("hide-btn");
    hudPanel.classList.add("hide-cntrl");
}

/**
 * Mutes all audio, persists the mute state in localStorage and updates the mute buttons.
 */
function muteAudio() {
    isMuted = true;
    localStorage.setItem("mutedKey", true);
    muteButton.classList.add("hide-btn");
    unmuteButton.classList.remove("hide-btn");
    AudioHub.muteAll();
}

/**
 * Unmutes all audio, persists the mute state in localStorage and updates the mute buttons.
 */
function unmuteAudio() {
    isMuted = false;
    localStorage.setItem("mutedKey", false);
    muteButton.classList.remove("hide-btn");
    unmuteButton.classList.add("hide-btn");
    AudioHub.unmuteAll();
}

/**
 * Switches to fullscreen mode and updates the fullscreen toggle buttons.
 */
function showFullscreen() {
    fullscreenBtn.classList.add("hide-btn");
    normScreenBtn.classList.remove("hide-btn");
    toggleFullscreen(fullscreen);
}

/**
 * Exits fullscreen mode and updates the fullscreen toggle buttons.
 */
function exitFullscreen() {
    fullscreenBtn.classList.remove("hide-btn");
    normScreenBtn.classList.add("hide-btn");
    toggleFullscreen(fullscreen);
}

/**
 * Toggles fullscreen mode for the given element.
 * Uses vendor-prefixed methods for broader browser compatibility.
 * Refocuses the canvas after the toggle if it exists.
 * @param {HTMLElement} element - The element to toggle fullscreen on.
 */
function toggleFullscreen(element) {
    if (!document.fullscreenElement) {
        element.requestFullscreen?.() ||
            element.msRequestFullscreen?.() ||
            element.webkitRequestFullscreen?.();
    } else {
        document.exitFullscreen();
    }
    if (canvas) {
        canvas.focus();
    }
}

/**
 * Applies the stored mute state on page load.
 * If muted, hides the mute button, shows the unmute button and mutes all audio.
 */
function applyMuteState() {
    if (isMuted) {
        muteButton.classList.add("hide-btn");
        unmuteButton.classList.remove("hide-btn");
        AudioHub.muteAll();
    }
}

//#endregion

//#region dialog

/**
 * Handles all dialog-related button clicks and delegates to the appropriate function.
 * @param {MouseEvent} event - The click event from the dialog button.
 */
function manageDialog(event) {
    const clickedBtn = event.currentTarget.id;
    if (clickedBtn === "control-btn") {
        openControlsDialog();
    } else if (clickedBtn === "imprint-btn") {
        openImprintDialog();
    } else if (
        clickedBtn === "close-btn-cntrl" ||
        clickedBtn === "close-btn-imprint"
    ) {
        closeDialog();
    } else if (clickedBtn === "start-btn" || clickedBtn === "restart-btn") {
        renderWorld();
    }
}

/**
 * Opens the imprint modal dialog and prevents background scrolling.
 */
function openImprintDialog() {
    document.body.classList.add("overscroll_stop");
    imprintDialog.showModal();
    imprintDialog.classList.add("opened");
}

/**
 * Opens the controls modal dialog and prevents background scrolling.
 */
function openControlsDialog() {
    document.body.classList.add("overscroll_stop");
    controlsDialog.showModal();
    controlsDialog.classList.add("opened");
}

/**
 * Closes both modal dialogs and restores background scrolling.
 */
function closeDialog() {
    document.body.classList.remove("overscroll_stop");
    imprintDialog.close();
    imprintDialog.classList.remove("opened");
    controlsDialog.close();
    controlsDialog.classList.remove("opened");
}

/**
 * Stops a click event from bubbling up to the dialog backdrop,
 * preventing the dialog from closing when clicking inside the content area.
 * @param {MouseEvent} event - The click event to stop.
 */
function bubblingProtection(event) {
    event.stopPropagation();
}

//#endregion

init();
