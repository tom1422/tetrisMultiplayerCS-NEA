import Observer from "./KeyUpdateObserverInterface";

export default interface InputManagerSubjectInterface {

    readonly keyPressed: string;
    readonly keyReleased: string;

    // Attach an observer to the subject.
    attach(observer: Observer): void;

    // Detach an observer from the subject.
    detach(observer: Observer): void;

    // Notify all observers about an event.
    notifyPress(): void;

    notifyRelease(): void;
}