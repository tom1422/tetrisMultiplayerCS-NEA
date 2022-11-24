import GridRenderer, {RenderedGrid, RenderedRectangle, RenderedText} from "./GridRenderer";
import * as p5 from "p5";
import Colour from "../../other/Colour";
import Renderer from "../Renderer";

export default class GridRendererP5 implements GridRenderer {

    private sketch: p5;
    private renderer: Renderer; //Will only have this if it's the base MenuItemRenderer

    items: any[] = [];

    constructor(sketch: p5) {
        this.sketch = sketch;
    }

    updateLoop() {

    }

    getUpdateLoop(): Function {
        return this.updateLoop.bind(this);
    }

    clearObjects(): void {
    }

    drawThisFrame(): void {

        this.items.forEach( (arrayItem: any) => {
            if (arrayItem.isGrid) {
                let value: RenderedGrid = arrayItem;
                if (value.gridArray == undefined) return;
                let gridArray = value.gridArray;
                for (let i: number = 0; i < gridArray.length; i++) {
                    for (let j: number = 0; j < gridArray[i].length; j++) {
                        //Draw celled brick!
                        if (gridArray[i][j] == 0 && value.zeroIsTransparent) continue;
                        let col = this.getRGBFromBrickID(gridArray[i][j]);
                        this.sketch.fill(col.r, col.g, col.b, col.a)
                        this.sketch.stroke(col.r - 40, col.g - 40, col.b - 40, 255);
                        this.sketch.strokeWeight(value.boxRadius);
                        this.sketch.rect(value.pos.x + (value.boxWidth + value.boxRadius) * i, value.pos.y + (value.boxHeight + value.boxRadius) * j,
                            value.boxWidth, value.boxHeight, value.boxRadius);
                    }
                }
            } else if (arrayItem.isRect) {
                let value: RenderedRectangle = arrayItem;
                this.sketch.strokeWeight(value.radius);
                this.sketch.fill(value.colour.r, value.colour.g, value.colour.b, value.colour.a)
                if (value.strokeColour == undefined) {
                    this.sketch.noStroke()
                } else {
                    this.sketch.stroke(value.strokeColour.r, value.strokeColour.g, value.strokeColour.b)
                }
                this.sketch.rect(value.pos.x, value.pos.y, value.width, value.height, value.radius);
            } else if (arrayItem.isText) {
                let value: RenderedText = arrayItem;
                this.sketch.textSize(value.fontSize)
                this.sketch.fill(value.colour.r, value.colour.g, value.colour.b)
                if (value.strokeColour == undefined) {
                    this.sketch.noStroke()
                } else {
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
            }
        });
    }

    createGrid(properties: RenderedGrid): string {
        properties.isGrid = true;
        return (this.items.push({type: 0, properties: properties})-1).toString();
    }

    createRectangle(properties: RenderedRectangle): string {
        properties.isRect = true;
        return (this.items.push({type: 1, properties: properties})-1).toString();
    }

    createText(properties: RenderedText): string {
        properties.isText = true;
        return (this.items.push({type: 2, properties: properties})-1).toString();
    }

    updateGrid(id: string, properties: RenderedGrid): void {
        let currentProperties: RenderedGrid = this.items[parseInt(id)].properties;
        currentProperties.gridArray = (properties.gridArray == undefined ? currentProperties.gridArray : properties.gridArray)
        currentProperties.pos = (properties.pos == undefined ? currentProperties.pos : properties.pos)
        currentProperties.boxWidth = (properties.boxWidth == undefined ? currentProperties.boxWidth : properties.boxWidth)
        currentProperties.boxHeight = (properties.boxHeight == undefined ? currentProperties.boxHeight : properties.boxHeight)
        currentProperties.boxRadius = (properties.boxRadius == undefined ? currentProperties.boxRadius : properties.boxRadius)
        this.items[parseInt(id)].properties = currentProperties;
    }

    updateRectangle(id: string, properties: RenderedRectangle): void {
        let currentProperties: RenderedRectangle = this.items[parseInt(id)].properties;
        currentProperties.pos = (properties.pos == undefined ? currentProperties.pos : properties.pos)
        currentProperties.width = (properties.width == undefined ? currentProperties.width : properties.width)
        currentProperties.height = (properties.height == undefined ? currentProperties.height : properties.height)
        currentProperties.radius = (properties.radius == undefined ? currentProperties.radius : properties.radius)
        currentProperties.colour = (properties.colour == undefined ? currentProperties.colour : properties.colour)
        currentProperties.strokeColour = (properties.strokeColour == undefined ? currentProperties.strokeColour : properties.strokeColour)
        this.items[parseInt(id)].properties = currentProperties;
    }

    updateText(id: string, properties: RenderedText): void {
        let currentProperties: RenderedText = this.items[parseInt(id)].properties;
        currentProperties.pos = (properties.pos == undefined ? currentProperties.pos : properties.pos)
        currentProperties.text = (properties.text == undefined ? currentProperties.text : properties.text)
        currentProperties.textAlign = (properties.textAlign == undefined ? currentProperties.textAlign : properties.textAlign)
        currentProperties.fontName = (properties.fontName == undefined ? currentProperties.fontName : properties.fontName)
        currentProperties.fontSize = (properties.fontSize == undefined ? currentProperties.fontSize : properties.fontSize)
        currentProperties.colour = (properties.colour == undefined ? currentProperties.colour : properties.colour)
        currentProperties.strokeColour = (properties.strokeColour == undefined ? currentProperties.strokeColour : properties.strokeColour)
        this.items[parseInt(id)].properties = currentProperties;
    }


    get canvasHeight(): number {
        return this.sketch.height;
    }

    get canvasWidth(): number {
        return this.sketch.width;
    }

    getRGBFromBrickID(brickID: number): Colour {
        switch (brickID) {
            case -1:
                return new Colour(0, 0, 0, 255);
            case 0:
                return new Colour(161, 161, 161);
            case 1:
                return new Colour(102, 205, 204);
            case 2:
                return new Colour(255, 102, 153);
            case 3:
                return new Colour(214, 255, 104);
            case 4:
                return new Colour(255, 96, 79);
            case 5:
                return new Colour(86, 255, 151);
            default:
                return new Colour(0, 0, 0);
        }
    }

}