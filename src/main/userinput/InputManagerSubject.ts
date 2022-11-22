import KeyboardInputInterface from "./KeyboardInputInterface";
import Observer from "./KeyUpdateObserverInterface";
import InputManagerSubjectInterface from "./InputManagerSubjectInterface";

export default class InputManagerSubject implements InputManagerSubjectInterface {

    keyboardInput: KeyboardInputInterface;

    keyPressed: string;
    keyReleased: string;

    constructor(keyboardInput: KeyboardInputInterface) {
        this.keyboardInput = keyboardInput;
        this.keyboardInput.runOnKeyDown(this.keyDown.bind(this));
        this.keyboardInput.runOnKeyUp(this.keyUp.bind(this));
    }

    private observers: Observer[] = [];

    attach(observer: Observer): void {
        const isExist = this.observers.includes(observer);
        if (isExist) {
            return;
        }

        this.observers.push(observer);
    }

    detach(observer: Observer): void {
        const observerIndex = this.observers.indexOf(observer);
        if (observerIndex === -1) {
            return;
        }

        this.observers.splice(observerIndex, 1);
    }

    notifyPress(): void {
        for (const observer of this.observers) {
            observer.keyPress(this);
        }
    }

    notifyRelease(): void {
        for (const observer of this.observers) {
            observer.keyRelease(this);
        }
    }

    keyDown(key: string) {
        this.keyPressed = key;
        this.notifyPress();
    }

    keyUp(key: string) {
        this.keyReleased = key;
        this.keyPressed = undefined;
        this.notifyRelease();
    }
}