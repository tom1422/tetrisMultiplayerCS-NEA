import GridRenderer from "./GridRenderer";
import Colour from "../../other/Colour";

import * as p5 from "p5";
import MenuItemRenderer, {RenderedLine, RenderedRectangle, RenderedText} from "./MenuItemRenderer";
import Renderer from "../Renderer";

export default class MenuItemRendererP5 implements MenuItemRenderer {

    private sketch: p5;
    private renderer: Renderer; //Will only have this if it's the base MenuItemRenderer

    constructor(sketch: p5, renderer?: Renderer) {
        this.sketch = sketch;
        this.renderer = renderer;
    }

    lineMap: RenderedLine[] = [];
    rectangleMap: RenderedRectangle[] = [];
    textMap: RenderedText[] = [];

    updateLoop() {

    }

    getUpdateLoop(): Function {
        return this.updateLoop.bind(this);
    }

    make(): MenuItemRenderer {
        if (this.renderer == undefined) {
            console.error("Attempt to make another renderer from non-base renderer!")
            return;
        }
        return this.renderer.makeMenuItemRendererP5();
    }

    clearObjects(): void {
        this.lineMap = [];
        this.rectangleMap = [];
        this.textMap = [];
    }

    drawThisFrame(): void {
        this.lineMap.forEach((value: RenderedLine) => {
            this.sketch.stroke(0, 0, 0);
            this.sketch.strokeWeight(1);
            this.sketch.line(value.x1, value.y1, value.x2, value.y2);
        });

        this.rectangleMap.forEach((value: RenderedRectangle) => {
            this.sketch.fill(value.colour.r, value.colour.g, value.colour.b)
            if (value.strokeColour == undefined) {
                this.sketch.noStroke()
            } else {
                this.sketch.strokeWeight(1);
                this.sketch.stroke(value.strokeColour.r, value.strokeColour.g, value.strokeColour.b)
            }
            this.sketch.rect(value.x, value.y, value.width, value.height, value.radius);
        });
        this.textMap.forEach((value: RenderedText) => {
            this.sketch.textSize(value.fontSize)
            this.sketch.fill(value.colour.r, value.colour.g, value.colour.b)
            if (value.strokeColour == undefined) {
                this.sketch.noStroke()
            } else {
                this.sketch.strokeWeight(1);
                this.sketch.stroke(value.strokeColour.r, value.strokeColour.g, value.strokeColour.b)
            }
            switch (value.textAlign) {
                case 0:
                    this.sketch.textAlign(this.sketch.LEFT, this.sketch.CENTER)
                    break;
                case 1:
                    this.sketch.textAlign(this.sketch.CENTER, this.sketch.CENTER)
                    break;
                case 2:
                    this.sketch.textAlign(this.sketch.RIGHT, this.sketch.CENTER)
                    break;
            }
            this.sketch.text(value.text, value.x, value.y)
        });
    }

    createLine(properties: RenderedLine): string {
        return (this.lineMap.push(properties)-1).toString();
    }

    createRectangle(properties: RenderedRectangle): string {
        return (this.rectangleMap.push(properties)-1).toString();
    }

    createText(properties: RenderedText): string {
        return (this.textMap.push(properties)-1).toString();
    }

    updateLine(id: string, properties: RenderedLine): void {
        let currentProperties: RenderedLine = this.lineMap[parseInt(id)];
        currentProperties.x1 = (properties.x1 == undefined ? currentProperties.x1 : properties.x1)
        currentProperties.x2 = (properties.x2 == undefined ? currentProperties.x2 : properties.x2)
        currentProperties.y1 = (properties.y1 == undefined ? currentProperties.y1 : properties.y1)
        currentProperties.y2 = (properties.y2 == undefined ? currentProperties.y2 : properties.y2)
        this.lineMap[parseInt(id)] = currentProperties;
    }

    updateRectangle(id: string, properties: RenderedRectangle): void {
        let currentProperties: RenderedRectangle = this.rectangleMap[parseInt(id)];
        currentProperties.x = (properties.x == undefined ? currentProperties.x : properties.x)
        currentProperties.y = (properties.y == undefined ? currentProperties.y : properties.y)
        currentProperties.width = (properties.width == undefined ? currentProperties.width : properties.width)
        currentProperties.height = (properties.height == undefined ? currentProperties.height : properties.height)
        currentProperties.radius = (properties.radius == undefined ? currentProperties.radius : properties.radius)
        currentProperties.colour = (properties.colour == undefined ? currentProperties.colour : properties.colour)
        currentProperties.strokeColour = (properties.strokeColour == undefined ? currentProperties.strokeColour : properties.strokeColour)
        this.rectangleMap[parseInt(id)] = currentProperties;
    }

    updateText(id: string, properties: RenderedText): void {
        let currentProperties: RenderedText = this.textMap[parseInt(id)];
        currentProperties.x = (properties.x == undefined ? currentProperties.x : properties.x)
        currentProperties.y = (properties.y == undefined ? currentProperties.y : properties.y)
        currentProperties.text = (properties.text == undefined ? currentProperties.text : properties.text)
        currentProperties.textAlign = (properties.textAlign == undefined ? currentProperties.textAlign : properties.textAlign)
        currentProperties.fontName = (properties.fontName == undefined ? currentProperties.fontName : properties.fontName)
        currentProperties.fontSize = (properties.fontSize == undefined ? currentProperties.fontSize : properties.fontSize)
        currentProperties.colour = (properties.colour == undefined ? currentProperties.colour : properties.colour)
        currentProperties.strokeColour = (properties.strokeColour == undefined ? currentProperties.strokeColour : properties.strokeColour)
        this.textMap[parseInt(id)] = currentProperties;
    }

    get mouseButton(): string {
        return this.sketch.mouseButton;
    }

    get mouseIsPressed(): boolean {
        return this.sketch.mouseIsPressed;
    }

    get mouseX(): number {
        return this.sketch.mouseX;
    }

    get mouseY(): number {
        return this.sketch.mouseY;
    }


}