import MenuItem from "./MenuItem";
import * as p5 from "p5";
import Renderer from "../renderer/Renderer";
import Colour from "../other/Colour";
import MenuItemRenderer from "../renderer/SpecificRenderers/MenuItemRenderer";

export default class Text implements MenuItem {
    private menuItemRenderer: MenuItemRenderer;
    private fontSize: number;
    private weight: number;
    private font: string;
    private colour: Colour;
    private text: string;

    public height: number;
    readonly align: number;

    private graphicTextID: string;

    private xPos: number = 0;
    private yPos: number = 0;

    constructor(menuItemRenderer: MenuItemRenderer, text: string, fontSize: number, colour: Colour, weight: number, align: number, font: string) {
        this.menuItemRenderer = menuItemRenderer;
        this.text = text;
        this.fontSize = fontSize;
        this.weight = weight;
        this.font = font;
        this.colour = colour;
        this.height = fontSize;
        this.align = align;

        this.createText();
    }

    update(): boolean {
        this.menuItemRenderer.drawThisFrame();
        return true;
    }

    setPosition(xPos: number, yPos: number): void {
        this.xPos = xPos;
        this.yPos = yPos;
        this.menuItemRenderer.updateText(this.graphicTextID, {
            x: xPos,
            y: yPos + this.fontSize/2,
        });
    }

    setText(newText: string) {
        this.text = newText;
        this.menuItemRenderer.updateText(this.graphicTextID, {
            text: this.text,
        });
    }

    createText(): void {
        const xPos = 0;
        const yPos = 0;
        this.graphicTextID = this.menuItemRenderer.createText({
            text: this.text,
            x: xPos,
            y: yPos + this.fontSize/2,
            fontSize: this.fontSize,
            textAlign: this.align,
            fontName: this.font,
            colour: this.colour,
            strokeColour: undefined,
        });
    }
}