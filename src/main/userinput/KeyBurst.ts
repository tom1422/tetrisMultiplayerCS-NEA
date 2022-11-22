export default class KeyBurst {

    keyPressed: string;
    keyReleased: string;

    pressTime: number = 0;

    sendRate: number = 50; //Millisecond interval of which to send key updates when held.
    holdDelay: number = 190; //Milliseconds for which holding it will cause it to send updates.

    burstEvent: Function;

    constructor(burstEvent: Function) {
        this.burstEvent = burstEvent;
    }

    update(): void {
        if (this.keyPressed != undefined) {
            let now = new Date();
            if (now.getTime() > this.pressTime) {
                this.pressTime += this.sendRate;
                this.burstEvent();
            }
        }
    }

    keyDown(key: string) {
        this.keyPressed = key;
        this.pressTime = (new Date().getTime()) + this.holdDelay;
    }

    keyUp(key: string) {
        if (this.keyPressed == key) {
            this.keyPressed = undefined;
        }
        this.keyReleased = key;
    }
}