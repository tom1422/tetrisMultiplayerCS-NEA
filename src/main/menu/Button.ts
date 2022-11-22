import * as p5 from "p5";
import Colour from "../other/Colour";
import Renderer from "../renderer/Renderer";
import MenuItem from "./MenuItem";
import ClickerComponent from "./reusable/ClickerComponent";
import MenuItemRenderer from "../renderer/SpecificRenderers/MenuItemRenderer";

export default class Button implements MenuItem {

    private menuItemRenderer: MenuItemRenderer;
    private text: string;
    private width: number;
    private weight: number;
    public height: number;
    public callback: Function;

    private fontSize: number = 16;
    private colour: Colour = new Colour(60, 153, 95);
    private colourHovered: Colour = new Colour(31, 122 ,63);
    private colourClicked: Colour = new Colour(18, 97 ,46);
    private colourText: Colour = new Colour(0, 0, 0);
    private _currentColour: Colour = this.colour;
    private get currentColour() {
        return this._currentColour;
    }
    private set currentColour(newCol: Colour) {
        if (this._currentColour !== newCol) {
            this._currentColour = newCol;
            this.updateColour();
        }
    }

    private clickerComponent: ClickerComponent;

    private graphicRectangleID: string;
    private graphicTextID: string;

    private xPos: number = 0;
    private yPos: number = 0;

    constructor(menuItemRenderer: MenuItemRenderer, text: string, width: number, height: number, weight: number, callback: Function) {
        this.menuItemRenderer = menuItemRenderer;
        this.text = text;
        this.width = width;
        this.height = height;
        this.weight = weight;
        this.callback = callback;

        this.clickerComponent = new ClickerComponent(menuItemRenderer, width, height);

        this.makeButtonGraphic();
    }

    makeButtonGraphic() {
        const xPos = 20;
        const yPos = 20;
        this.graphicRectangleID = this.menuItemRenderer.createRectangle({
            x: (xPos) - (this.width / 2),
            y: yPos,
            width: this.width,
            height: this.height,
            radius: 10,
            colour: this.currentColour,
            strokeColour: new Colour(1, 1, 1)});

        this.graphicTextID = this.menuItemRenderer.createText({
            text: this.text,
            x: (xPos),
            y: yPos,
            fontSize: this.fontSize,
            textAlign: 1,
            fontName: "Trebuchet MS",
            colour: this.colourText,
            strokeColour: undefined});
    }

    setPosition(xPos: number, yPos: number): void {
        this.xPos = xPos;
        this.yPos = yPos;

        this.menuItemRenderer.updateRectangle(this.graphicRectangleID, {
            x: (this.xPos) - (this.width / 2),
            y: this.yPos,
            width: undefined,
            height: undefined,
            radius: undefined,
            colour: this.currentColour,
            strokeColour: undefined
        });

        this.menuItemRenderer.updateText(this.graphicTextID, {
            text: undefined,
            x: (this.xPos),
            y: this.yPos + (this.height / 2),
            fontSize: undefined,
            textAlign: undefined,
            fontName: undefined,
            colour: undefined,
            strokeColour: undefined
        });
    }

    updateColour() {
        this.menuItemRenderer.updateRectangle(this.graphicRectangleID, {
            x: undefined,
            y: undefined,
            width: undefined,
            height: undefined,
            radius: undefined,
            colour: this.currentColour,
            strokeColour: undefined
        });
    }

    update(): boolean {
        this.checkClick(this.xPos, this.yPos);
        this.menuItemRenderer.drawThisFrame();

        return true;
    }

    public checkClick(xPos: number, yPos: number): void {
        this.clickerComponent.update((xPos) - (this.width / 2), yPos);

        if (this.clickerComponent.hovered) {
            if (this.clickerComponent.stayDown) {
                this.currentColour = this.colourClicked;
            } else {
                this.currentColour = this.colourHovered;
            }
        } else {
            this.currentColour = this.colour;
        }

        if (this.clickerComponent.wentUp && this.clickerComponent.wentDownInBox) {
            if (this.clickerComponent.hovered) {
                //Clicked fully
                this.callback();
            }
        }
    }

}