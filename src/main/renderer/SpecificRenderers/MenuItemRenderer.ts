import Colour from "../../other/Colour";
import Coordinate from "../../other/Coordinate";
import {coordinate} from "../../../three/renderedObjects/wt2positionTranslator";

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
    isLine?: boolean;
    pos1?: Coordinate;
    pos2?: coordinate;
};

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