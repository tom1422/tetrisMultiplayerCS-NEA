import Colour from "../../other/Colour";
import {RenderedLine} from "./MenuItemRenderer";
import Coordinate from "../../other/Coordinate";

export default interface GridRenderer {

    get canvasWidth(): number;
    get canvasHeight(): number;

    getUpdateLoop(): Function;

    drawThisFrame(): void;      //Called each frame to keep it rendered
    clearObjects(): void;       //Delete all rendered objects

    createRectangle(properties: RenderedRectangle): string;                     //Returns UUID of object when created
    createText(properties: RenderedText): string;                               //Returns UUID of object when created
    createGrid(properties: RenderedGrid): string;                               //Returns UUID of object when created

    updateRectangle(id: string, properties: RenderedRectangle): void;           //Updates properties of existing object
    updateText(id: string, properties: RenderedText): void;                     //Updates properties of existing object
    updateGrid(id: string, properties: RenderedGrid): void;                     //Updates properties of existing object
}

export type RenderedRectangle = {
    isRect?: boolean;
    pos?: Coordinate;
    width?: number;
    height?: number;
    radius?: number;
    colour?: Colour;
    strokeColour?: Colour | undefined;
};

export type RenderedText = {
    isText?: boolean;
    text?: string;
    pos?: Coordinate;
    fontSize?: number;
    textAlign?: number;
    fontName?: string;
    colour?: Colour;
    strokeColour?: Colour | undefined;
};
export type RenderedGrid = {
    isGrid?: boolean;
    gridArray?: number[][];
    pos?: Coordinate;
    boxWidth?: number;
    boxHeight?: number;
    boxRadius?: number;
    zeroIsTransparent?: boolean;
};