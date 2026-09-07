import { Keyboard } from "./keyboard.class.js";
import { World } from "../models/world.class.js";
import { IntervalHub } from "./intervall-hub.class.js";
import { AudioHub } from "./audio-hub.class.js";
import { initLevel } from "../levels/level1.js";

const startButton = document.getElementById("start-btn");
const controlButton = document.getElementById("control-btn");
const imprintButton = document.getElementById("imprint-btn");
const closeButtonCntrl = document.getElementById("close-btn-cntrl");
const closeButtonImpr = document.getElementById("close-btn-imprint");
const homeButton = document.getElementById("home-btn");
const muteButton = document.getElementById("mute-btn");
const unmuteButton = document.getElementById("unmute-btn");
const fullscreenBtn = document.getElementById("fullscrn-btn");
const normScreenBtn = document.getElementById("normscrn-btn");
const restartBtn = document.getElementById("restart-btn");

const startScreen = document.getElementById("startScreen");
const controlPage = document.getElementById("control-page");
const imprintPage = document.getElementById("imprint-page");
const hudPanel = document.getElementById("hud");
const fullscreen = document.getElementById("fullscreen");

const imprintDialog = document.getElementById("imprint_dialog");
const controlsDialog = document.getElementById("controls_dialog");

let canvas;
let world;
let keyboard = new Keyboard();
let isMuted = localStorage.getItem("mutedKey") === "true";

//beim Laden der Webiste ausgeführt
function init() {
    manageClickEvents();
    applyMuteState();
    startMusic();
}

// click-events für Buttons im Menü & Dialog
function manageClickEvents() {
    interfaceEvents();
    navEvents();
    dialogEvents();
}

// InterfaceButtons
function interfaceEvents() {
    homeButton.addEventListener("click", manageInterface);
    muteButton.addEventListener("click", manageInterface);
    unmuteButton.addEventListener("click", manageInterface);
    fullscreenBtn.addEventListener("click", manageInterface);
    normScreenBtn.addEventListener("click", manageInterface);
}

// Navigation-Buttons
function navEvents() {
    controlButton.addEventListener("click", manageNavigation);
    imprintButton.addEventListener("click", manageNavigation);
    closeButtonCntrl.addEventListener("click", manageNavigation);
    closeButtonImpr.addEventListener("click", manageNavigation);
    startButton.addEventListener("click", manageNavigation);
    restartBtn.addEventListener("click", manageNavigation);
}

// Dialog schließen & bubblinProtection
function dialogEvents() {
    imprintDialog.addEventListener("click", closeDialog);
    controlsDialog.addEventListener("click", closeDialog);
    controlPage.addEventListener("click", bubblingProtection);
    imprintPage.addEventListener("click", bubblingProtection);
    screen.orientation.addEventListener("change", closeDialog);
}

// mit erstem Klick auf der Seite wird der Sound abgespielt
function startMusic() {
    document.addEventListener(
        "click",
        (event) => {
            if (event.target !== startButton && event.target !== restartBtn) {
                AudioHub.playOne(AudioHub.GAME.main);
            }
        },
        { once: true }, // sorgt dafür, dass event listener nur einmal benötigt wird pro session
    );
}

//#region keyboard

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

//#region homeNavigation

function manageNavigation(event) {
    const clickedBtn = event.currentTarget.id;
    if (clickedBtn === "control-btn") {
        // showControls();
        openControlsDialog();
    } else if (clickedBtn === "imprint-btn") {
        // showImprint();
        openImprintDialog();
    } else if (
        clickedBtn === "close-btn-cntrl" ||
        clickedBtn === "close-btn-imprint"
    ) {
        // goBack();
        closeDialog();
    } else if (clickedBtn === "start-btn" || clickedBtn === "restart-btn") {
        renderWorld();
    }
}

function showControls() {
    // startScreen.classList.add("hide-page");
    controlPage.classList.remove("hide-page");
}

function showImprint() {
    // startScreen.classList.add("hide-page");
    imprintPage.classList.remove("hide-page");
}

function goBack() {
    controlPage.classList.add("hide-page");
    imprintPage.classList.add("hide-page");
    // startScreen.classList.remove("hide-page");
}

function renderWorld() {
    startScreen.classList.add("hide-page");
    homeButton.classList.remove("hide-btn");
    restartBtn.classList.add("hide-btn");
    controlButton.classList.add("hide-btn");
    imprintButton.classList.add("hide-btn");
    canvas = document.getElementById("canvas");
    if (world) {
        cancelAnimationFrame(world.drawID);
    }
    initLevel();
    world = new World(canvas, keyboard);
    world.onEndScreen = toggleRestartBtn;
    toggleRestartBtn();
    AudioHub.stopOne(AudioHub.GAME.main);
    AudioHub.stopOne(AudioHub.GAME.win);
    AudioHub.stopOne(AudioHub.GAME.gameOver);
    AudioHub.playOne(AudioHub.GAME.start);
    AudioHub.playOne(AudioHub.GAME.bgm);
    hudPanel.classList.remove("hide-cntrl");
}

function toggleRestartBtn() {
    restartBtn.classList.toggle("hide-btn", world.gameEnd === false);
}

//#endregion

//#region interface

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

function goHome() {
    startScreen.classList.remove("hide-page");
    homeButton.classList.add("hide-btn");
    restartBtn.classList.add("hide-btn");
    controlButton.classList.remove("hide-btn");
    imprintButton.classList.remove("hide-btn");
    IntervalHub.stopAllIntervals();
    cancelAnimationFrame(world.drawID);
    AudioHub.stopOne(AudioHub.GAME.bgm);
    AudioHub.stopOne(AudioHub.GAME.win);
    AudioHub.stopOne(AudioHub.GAME.gameOver);
    AudioHub.playOne(AudioHub.GAME.main);
    hudPanel.classList.add("hide-cntrl");
}

function muteAudio() {
    isMuted = true;
    localStorage.setItem("mutedKey", true);
    muteButton.classList.add("hide-btn");
    unmuteButton.classList.remove("hide-btn");
    AudioHub.muteAll();
}

function unmuteAudio() {
    isMuted = false;
    localStorage.setItem("mutedKey", false);
    muteButton.classList.remove("hide-btn");
    unmuteButton.classList.add("hide-btn");
    AudioHub.unmuteAll();
}

function showFullscreen() {
    fullscreenBtn.classList.add("hide-btn");
    normScreenBtn.classList.remove("hide-btn");
    toggleFullscreen(fullscreen);
}

function exitFullscreen() {
    fullscreenBtn.classList.remove("hide-btn");
    normScreenBtn.classList.add("hide-btn");
    toggleFullscreen(fullscreen);
}

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

function applyMuteState() {
    if (isMuted) {
        muteButton.classList.add("hide-btn");
        unmuteButton.classList.remove("hide-btn");
        AudioHub.muteAll();
    }
}

//#endregion

//#region dialog

function openImprintDialog() {
    document.body.classList.add("overscroll_stop");
    imprintDialog.showModal();
    imprintDialog.classList.add("opened");
}

function openControlsDialog() {
    document.body.classList.add("overscroll_stop");
    controlsDialog.showModal();
    controlsDialog.classList.add("opened");
}

function closeDialog() {
    document.body.classList.remove("overscroll_stop");
    imprintDialog.close();
    imprintDialog.classList.remove("opened");
    controlsDialog.close();
    controlsDialog.classList.remove("opened");
}

function bubblingProtection(event) {
    event.stopPropagation();
}

//#endregion

init();
