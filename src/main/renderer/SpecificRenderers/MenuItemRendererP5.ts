import GridRenderer from "./GridRenderer";
import Colour from "../../other/Colour";

import * as p5 from "p5";
import MenuItemRenderer, {RenderedLine, RenderedRectangle, RenderedText} from "./MenuItemRenderer";
import Renderer from "../Renderer";

export default class MenuItemRendererP5 implements MenuItemRenderer {

    private sketch: p5;

    constructor(sketch: p5) {
        this.sketch = sketch;
    }

    lineMap: RenderedLine[] = [];
    rectangleMap: RenderedRectangle[] = [];
    textMap: RenderedText[] = [];

    updateLoop() {

    }

    getUpdateLoop(): Function {
        return this.updateLoop.bind(this);
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
            this.sketch.line(value.pos1.x, value.pos1.y, value.pos2.x, value.pos2.y);
        });

        this.rectangleMap.forEach((value: RenderedRectangle) => {
            this.sketch.fill(value.colour.r, value.colour.g, value.colour.b)
            if (value.strokeColour == undefined) {
                this.sketch.noStroke()
            } else {
                this.sketch.strokeWeight(1);
                this.sketch.stroke(value.strokeColour.r, value.strokeColour.g, value.strokeColour.b)
            }
            this.sketch.rect(value.pos.x, value.pos.y, value.width, value.height, value.radius);
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
            this.sketch.text(value.text, value.pos.x, value.pos.y)
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
        currentProperties.pos1 = (properties.pos1 == undefined ? currentProperties.pos1 : properties.pos1)
        currentProperties.pos2 = (properties.pos2 == undefined ? currentProperties.pos2 : properties.pos2)
        this.lineMap[parseInt(id)] = currentProperties;
    }

    updateRectangle(id: string, properties: RenderedRectangle): void {
        let currentProperties: RenderedRectangle = this.rectangleMap[parseInt(id)];
        currentProperties.pos = (properties.pos == undefined ? currentProperties.pos : properties.pos)
        currentProperties.width = (properties.width == undefined ? currentProperties.width : properties.width)
        currentProperties.height = (properties.height == undefined ? currentProperties.height : properties.height)
        currentProperties.radius = (properties.radius == undefined ? currentProperties.radius : properties.radius)
        currentProperties.colour = (properties.colour == undefined ? currentProperties.colour : properties.colour)
        currentProperties.strokeColour = (properties.strokeColour == undefined ? currentProperties.strokeColour : properties.strokeColour)
        this.rectangleMap[parseInt(id)] = currentProperties;
    }

    updateText(id: string, properties: RenderedText): void {
        let currentProperties: RenderedText = this.textMap[parseInt(id)];
        currentProperties.pos = (properties.pos == undefined ? currentProperties.pos : properties.pos)
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