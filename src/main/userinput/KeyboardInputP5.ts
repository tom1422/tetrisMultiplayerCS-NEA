import KeyboardInputInterface from "./KeyboardInputInterface";
import * as p5 from "p5";

export default class KeyboardInputP5 implements KeyboardInputInterface {

    scene: p5;

    keyDown: Function;
    keyUp: Function;

    constructor(p5:p5) {
        this.scene = p5;
        this.scene.keyPressed = (() => {this.keyDown(this.scene.key)});
        this.scene.keyReleased = (() => {this.keyUp(this.scene.key)});
    }

    runOnKeyDown(callback: Function) {
        this.keyDown = callback;
    }

    runOnKeyUp(callback: Function) {
        this.keyUp = callback;
    }
}