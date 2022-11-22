export default interface MenuItem {
    readonly align?: number;
    update(): boolean; //Called every frame when the item should be active
    setPosition(xPos: number, yPos: number): void;
    height: number;
}