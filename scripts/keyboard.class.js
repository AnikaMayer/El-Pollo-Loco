export class Keyboard {
    LEFT = false;
    RIGHT = false;
    UP = false;
    DOWN = false;
    SPACE = false;
    D = false;
    touchBtns = [
        { id: "btnLeft", key: "LEFT" },
        { id: "btnRight", key: "RIGHT" },
        { id: "btnJump", key: "SPACE" },
        { id: "btnThrow", key: "D" },
    ];

    constructor() {
        this.touchControls();
    }

    touchControls() {
        this.touchBtns.forEach(({ id, key }) => {
            const btn = document.getElementById(id);
            btn.addEventListener(
                "touchstart",
                (e) => {
                    e.preventDefault();
                    this[key] = true;
                },
                { passive: false },
            );
            btn.addEventListener(
                "touchend",
                (e) => {
                    e.preventDefault();
                    this[key] = false;
                },
                { passive: false },
            );
        });
    }
}
