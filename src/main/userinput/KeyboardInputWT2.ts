import KeyboardInputInterface from "./KeyboardInputInterface";
import wumThree2D from "../../three/wumThree2D";

export default class KeyboardInputWT2 implements KeyboardInputInterface {

    keyDown: Function;
    keyUp: Function;

    constructor(wt2:wumThree2D) {
        document.addEventListener( 'keydown', (event) => {
            this.keyDown(event.key)
        });
        document.addEventListener( 'keyup', (event) => {
            this.keyUp(event.key)
        });
    }

    runOnKeyDown(callback: Function) {
        this.keyDown = callback;
    }

    runOnKeyUp(callback: Function) {
        this.keyUp = callback;
    }

}