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

let canvas;
let world;
let keyboard = new Keyboard();

function init() {
    manageClickEvents();
}

function manageClickEvents() {
    controlButton.addEventListener("click", manageNavigation);
    imprintButton.addEventListener("click", manageNavigation);
    closeButtonCntrl.addEventListener("click", manageNavigation);
    closeButtonImpr.addEventListener("click", manageNavigation);
    startButton.addEventListener("click", manageNavigation);

    homeButton.addEventListener("click", manageInterface);
    muteButton.addEventListener("click", manageInterface);
    unmuteButton.addEventListener("click", manageInterface);
    fullscreenBtn.addEventListener("click", manageInterface);
    normScreenBtn.addEventListener("click", manageInterface);
    restartBtn.addEventListener("click", manageNavigation);
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
        showControls();
    } else if (clickedBtn === "imprint-btn") {
        showImprint();
    } else if (
        clickedBtn === "close-btn-cntrl" ||
        clickedBtn === "close-btn-imprint"
    ) {
        goBack();
    } else if (clickedBtn === "start-btn" || clickedBtn === "restart-btn") {
        renderWorld();
    }
}

function showControls() {
    startScreen.classList.add("hide-page");
    controlPage.classList.remove("hide-page");
}

function showImprint() {
    startScreen.classList.add("hide-page");
    imprintPage.classList.remove("hide-page");
}

function goBack() {
    controlPage.classList.add("hide-page");
    imprintPage.classList.add("hide-page");
    startScreen.classList.remove("hide-page");
}

function renderWorld() {
    startScreen.classList.add("hide-page");
    homeButton.classList.remove("hide-btn");
    restartBtn.classList.add("hide-btn");
    canvas = document.getElementById("canvas");
    if (world) {
        cancelAnimationFrame(world.drawID);
    }
    initLevel();
    world = new World(canvas, keyboard);
    world.onEndScreen = toggleRestartBtn;
    toggleRestartBtn();
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
    IntervalHub.stopAllIntervals();
    cancelAnimationFrame(world.drawID);
}

function muteAudio() {
    muteButton.classList.add("hide-btn");
    unmuteButton.classList.remove("hide-btn");
    AudioHub.stopAll();
}

function unmuteAudio() {
    muteButton.classList.remove("hide-btn");
    unmuteButton.classList.add("hide-btn");
}

function showFullscreen() {
    fullscreenBtn.classList.add("hide-btn");
    normScreenBtn.classList.remove("hide-btn");
}

function exitFullscreen() {
    fullscreenBtn.classList.remove("hide-btn");
    normScreenBtn.classList.add("hide-btn");
}

//#endregion

init();
