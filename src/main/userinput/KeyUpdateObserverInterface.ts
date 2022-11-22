import KeyUpdateProvider from "./InputManagerSubjectInterface";

export default interface KeyUpdateObserverInterface {
    // Receive update from subject.
    keyPress(subject: KeyUpdateProvider): void;
    keyRelease(subject: KeyUpdateProvider): void;
}