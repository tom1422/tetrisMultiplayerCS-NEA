import KeyboardInputInterface from "./KeyboardInputInterface";
import wumThree2D from "../../three/wumThree2D";

export default class KeyboardInputWT2 implements KeyboardInputInterface {

    keyDown: Function;
    keyUp: Function;

    constructor(wt2:wumThree2D) {
        // this.scene.keyPressed = (() => {this.keyDown(this.scene.key)});
        // this.scene.keyReleased = (() => {this.keyUp(this.scene.key)});
    }

    runOnKeyDown(callback: Function) {
        this.keyDown = callback;
    }

    runOnKeyUp(callback: Function) {
        this.keyUp = callback;
    }

}