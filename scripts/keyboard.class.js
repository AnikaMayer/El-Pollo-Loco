export class Keyboard {
    LEFT = false;
    RIGHT = false;
    UP = false;
    DOWN = false;
    SPACE = false;
    D = false;

    constructor() {
        this.touchControls();
    }

    touchControls() {
        const buttons = [
            { id: "btnLeft", key: "LEFT" },
            { id: "btnRight", key: "RIGHT" },
            { id: "btnJump", key: "SPACE" },
            { id: "btnThrow", key: "D" },
        ];
        buttons.forEach(({ id, key }) => {
            const btn = document.getElementById(id);
            btn.addEventListener("touchstart", (e) => {
                e.preventDefault();
                this[key] = true;
            });
            btn.addEventListener("touchend", (e) => {
                e.preventDefault();
                this[key] = false;
            });
        });
    }
}
