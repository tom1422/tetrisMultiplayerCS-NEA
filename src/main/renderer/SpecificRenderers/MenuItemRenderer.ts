import Colour from "../../other/Colour";

export default interface MenuItemRenderer {


    get mouseButton(): string;
    get mouseIsPressed(): boolean;
    get mouseX(): number;
    get mouseY(): number;

    getUpdateLoop(): Function;

    drawThisFrame(): void;      //Called each frame to keep it rendered
    clearObjects(): void;       //Delete all rendered objects

    createRectangle(properties: RenderedRectangle): string;                     //Returns UUID of object when created

    createText(properties: RenderedText): string;                               //Returns UUID of object when created

    createLine(properties: RenderedLine): string;                               //Returns UUID of object when created

    updateRectangle(id: string, properties: RenderedRectangle): void;           //Updates properties of existing object

    updateText(id: string, properties: RenderedText): void;                     //Updates properties of existing object

    updateLine(id: string, properties: RenderedLine): void;                     //Updates properties of existing object

}

export type RenderedLine = {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
};

export type RenderedRectangle = {
    x: number;
    y: number;
    width: number;
    height: number;
    radius: number;
    colour: Colour;
    strokeColour: Colour | undefined;
};

export type RenderedText = {
    text: string;
    x: number;
    y: number;
    fontSize: number;
    textAlign: number;
    fontName: string;
    colour: Colour;
    strokeColour: Colour | undefined;
};