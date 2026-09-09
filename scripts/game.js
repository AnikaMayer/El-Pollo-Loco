import { Keyboard } from "./keyboard.class.js";
import { World } from "../models/world-builder/world.class.js";
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
 * Checks, if fullscreen-button should be hidden for browsers without Fullscreen API support.
 */
function init() {
    manageClickEvents();
    applyMuteState();
    startMusic();
    checkFullscreen();
}

//#region manageClick

/** Registers all click event listeners for buttons and dialogs. */
function manageClickEvents() {
    interfaceEvents();
    navEvents();
    dialogEvents();
}

/** Registers click events for interface control buttons. */
function interfaceEvents() {
    homeButton.addEventListener("click", manageInterface);
    muteButton.addEventListener("click", manageInterface);
    unmuteButton.addEventListener("click", manageInterface);
    fullscreenBtn.addEventListener("click", manageInterface);
    normScreenBtn.addEventListener("click", manageInterface);
}

/** Registers click events for navigation buttons. */
function navEvents() {
    controlButton.addEventListener("click", manageDialog);
    imprintButton.addEventListener("click", manageDialog);
    closeButtonCntrl.addEventListener("click", manageDialog);
    closeButtonImpr.addEventListener("click", manageDialog);

    startButton.addEventListener("click", manageStart);
    restartBtn.addEventListener("click", manageStart);
}

/** Registers click events for dialog backdrop closing and orientation changes. */
function dialogEvents() {
    imprintDialog.addEventListener("click", closeDialog);
    controlsDialog.addEventListener("click", closeDialog);
    controlPage.addEventListener("click", bubblingProtection);
    imprintPage.addEventListener("click", bubblingProtection);
    screen.orientation.addEventListener("change", closeDialog);
}

//#endregion

/** Plays the main menu music on the first click, unless the start button was clicked. */
function startMusic() {
    document.addEventListener(
        "click",
        (event) => {
            if (event.target !== startButton) {
                AudioHub.playOne(AudioHub.GAME.main);
            }
        },
        { once: true },
    );
}

/** Hides the fullscreen button on browsers without Fullscreen API support (e.g. iPhone Safari). */
function checkFullscreen() {
    const fullscreenSupported =
        document.documentElement.requestFullscreen ||
        document.documentElement.webkitRequestFullscreen ||
        document.documentElement.msRequestFullscreen;

    if (!fullscreenSupported) {
        fullscreenBtn.classList.add("hide-btn");
    }
}

//#region keyboard

/** Sets keyboard state to true on keydown. */
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

/** Sets keyboard state to false on keyup. */
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

/** Initializes or restarts the game world and updates the UI. */
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

/** Stops menu sounds and starts game audio. */
function worldAudio() {
    AudioHub.stopOne(AudioHub.GAME.main);
    AudioHub.stopOne(AudioHub.GAME.win);
    AudioHub.stopOne(AudioHub.GAME.gameOver);
    AudioHub.playOne(AudioHub.GAME.start);
    AudioHub.playOne(AudioHub.GAME.bgm);
}

/** Hides the start screen and shows the HUD and home button. */
function toggleHideWorld() {
    startScreen.classList.add("hide-page");
    homeButton.classList.remove("hide-btn");
    restartBtn.classList.add("hide-btn");
    controlButton.classList.add("hide-btn");
    imprintButton.classList.add("hide-btn");
    hudPanel.classList.remove("hide-cntrl");
}

/** Toggles the restart button based on whether the game has ended. */
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

/** Stops the game and returns to the home screen. */
function goHome() {
    IntervalHub.stopAllIntervals();
    cancelAnimationFrame(world.drawID);
    toggleHideHome();
    homeAudio();
}

/** Stops game sounds and plays the main menu music. */
function homeAudio() {
    AudioHub.stopOne(AudioHub.GAME.bgm);
    AudioHub.stopOne(AudioHub.GAME.win);
    AudioHub.stopOne(AudioHub.GAME.gameOver);
    AudioHub.playOne(AudioHub.GAME.main);
}

/** Shows the start screen and hides the HUD and home button. */
function toggleHideHome() {
    startScreen.classList.remove("hide-page");
    homeButton.classList.add("hide-btn");
    restartBtn.classList.add("hide-btn");
    controlButton.classList.remove("hide-btn");
    imprintButton.classList.remove("hide-btn");
    hudPanel.classList.add("hide-cntrl");
}

/** Mutes all audio and persists the mute state in localStorage. */
function muteAudio() {
    isMuted = true;
    localStorage.setItem("mutedKey", true);
    muteButton.classList.add("hide-btn");
    unmuteButton.classList.remove("hide-btn");
    AudioHub.muteAll();
}

/** Unmutes all audio and persists the mute state in localStorage. */
function unmuteAudio() {
    isMuted = false;
    localStorage.setItem("mutedKey", false);
    muteButton.classList.remove("hide-btn");
    unmuteButton.classList.add("hide-btn");
    AudioHub.unmuteAll();
}

/** Enters fullscreen mode and updates the toggle buttons. */
function showFullscreen() {
    fullscreenBtn.classList.add("hide-btn");
    normScreenBtn.classList.remove("hide-btn");
    toggleFullscreen(fullscreen);
}

/** Exits fullscreen mode and updates the toggle buttons. */
function exitFullscreen() {
    fullscreenBtn.classList.remove("hide-btn");
    normScreenBtn.classList.add("hide-btn");
    toggleFullscreen(fullscreen);
}

/**
 * Toggles fullscreen mode for the given element.
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

/** Applies the stored mute state on page load. */
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

/** Opens the imprint dialog and prevents background scrolling. */
function openImprintDialog() {
    document.body.classList.add("overscroll_stop");
    imprintDialog.showModal();
    imprintDialog.classList.add("opened");
}

/** Opens the controls dialog and prevents background scrolling. */
function openControlsDialog() {
    document.body.classList.add("overscroll_stop");
    controlsDialog.showModal();
    controlsDialog.classList.add("opened");
}

/** Closes both dialogs and restores background scrolling. */
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
