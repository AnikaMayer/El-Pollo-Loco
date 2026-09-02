import { Keyboard } from "./keyboard.class.js";
import { World } from "../models/world.class.js";

const startButton = document.getElementById("start-btn");
const controlButton = document.getElementById("control-btn");
const imprintButton = document.getElementById("imprint-btn");
const homeButtonCntrl = document.getElementById("home-btn-cntrl");
const homeButtonImpr = document.getElementById("home-btn-imprint");
const startScreen = document.getElementById("startScreen");
const controlPage = document.getElementById("control-page");
const imprintPage = document.getElementById("imprint-page");

let canvas;
let world;
let keyboard = new Keyboard();

function init() {
    manageClickEvents();
}

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

function showControls() {
    startScreen.classList.add("hide-page");
    controlPage.classList.remove("hide-page");
}

function showImprint() {
    startScreen.classList.add("hide-page");
    imprintPage.classList.remove("hide-page");
}

function goHome() {
    controlPage.classList.add("hide-page");
    imprintPage.classList.add("hide-page");
    startScreen.classList.remove("hide-page");
}

function manageNavigation(event) {
    const clickedBtn = event.target.id;

    if (clickedBtn === "control-btn") {
        showControls();
    } else if (clickedBtn === "imprint-btn") {
        showImprint();
    } else if (
        clickedBtn === "home-btn-cntrl" ||
        clickedBtn === "home-btn-imprint"
    ) {
        goHome();
    } else if (clickedBtn === "start-btn") {
        renderWorld();
    }
}

function manageClickEvents() {
    controlButton.addEventListener("click", manageNavigation);
    imprintButton.addEventListener("click", manageNavigation);
    homeButtonCntrl.addEventListener("click", manageNavigation);
    homeButtonImpr.addEventListener("click", manageNavigation);
    startButton.addEventListener("click", manageNavigation);
}

function renderWorld() {
    startScreen.classList.add("hide-page");
    canvas = document.getElementById("canvas");
    world = new World(canvas, keyboard);
}

init();
