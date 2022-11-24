import GridRenderer, {RenderedGrid, RenderedRectangle, RenderedText} from "./GridRenderer";
import * as p5 from "p5";
import wumThree2D from "../../../three/wumThree2D";
import wt2Rect, {rectPosInfo} from "../../../three/renderedObjects/wt2Rect";
import wt2Text, {textPosInfo} from "../../../three/renderedObjects/wt2Text";
import Coordinate from "../../other/Coordinate";
import Colour from "../../other/Colour";
import * as THREE from "three";
import wt2Grid, {gridPosInfo} from "../../../three/renderedObjects/wt2Grid";
import UsefulUtils from "../../other/UsefulUtils";
import {Color} from "three";

export default class GridRendererWT2 implements GridRenderer {

    wt2: wumThree2D;
    visible: boolean = true;
    updateThisFrame: boolean = false;

    wt2Shapes: any[] = [];

    constructor(wt2: wumThree2D) {
        this.wt2 = wt2;
    }

    updateLoop() {
        if (this.updateThisFrame) {
            this.updateThisFrame = false;
            this.showAll();
        } else {
            this.hideAll();
        }
    }

    getUpdateLoop(): Function {
        return this.updateLoop.bind(this);
    }

    hideAll(): void {
        if (this.visible) {
            this.wt2Shapes.forEach((renderedItem: any) => {
                renderedItem.hide();
            });
            this.visible = false;
        }
    }

    showAll(): void {
        if (!this.visible) {
            this.wt2Shapes.forEach( (renderedItem: any) => {
                renderedItem.show();
            });
            this.visible = true;
        }
    }

    clearObjects(): void {

    }

    drawThisFrame(): void {
        this.updateThisFrame = true;
    }

    createGrid(properties: RenderedGrid): string {
        let grid = new wt2Grid(this.wt2.renderer);
        const index = this.wt2Shapes.push(grid)-1;

        grid.make(this.translateGrid(properties.pos, properties.boxWidth, properties.boxHeight, properties.boxRadius), properties.gridArray, properties.zeroIsTransparent);
        grid.setColours(this.translateColourGrid(properties.gridArray, properties.zeroIsTransparent));
        grid.setWeight(index);

        return (index).toString();
    }

    createRectangle(properties: RenderedRectangle): string {
        let rect = new wt2Rect(this.wt2.renderer);
        const index = this.wt2Shapes.push(rect)-1;

        rect.make(this.translateRect(properties.pos, properties.width, properties.height, properties.radius, 1));
        rect.setColour(this.translateColour(properties.colour));
        rect.setStrokeColour(this.translateColour(properties.strokeColour));
        rect.setWeight(index);

        return (index).toString();
    }

    createText(properties: RenderedText): string {
        let text = new wt2Text(this.wt2.renderer);
        const index = this.wt2Shapes.push(text)-1;

        text.make(this.translateText(properties.pos, properties.fontSize), properties.text, this.wt2.renderer.fonts[0], properties.textAlign);
        text.setColour(this.translateColour(properties.colour))
        text.setWeight(index);

        return (index).toString();
    }

    updateGrid(id: string, properties: RenderedGrid): void {
        if (id == undefined) return;
        let gridToUpdate: wt2Grid = this.wt2Shapes[parseInt(id)]

        if (properties.pos != undefined) gridToUpdate.setPosition(this.translateCoordinates(properties.pos));
        if (properties.gridArray != undefined) gridToUpdate.setColours(this.translateColourGrid(properties.gridArray, properties.zeroIsTransparent));
    }

    updateRectangle(id: string, properties: RenderedRectangle): void {
        if (id == undefined) return;
        let rectToUpdate: wt2Rect = this.wt2Shapes[parseInt(id)]

        if (properties.pos != undefined) rectToUpdate.setPosition(this.translateCoordinates(properties.pos));
        if (properties.colour != undefined) rectToUpdate.setColour(this.translateColour(properties.colour));
        if (properties.strokeColour != undefined) rectToUpdate.setStrokeColour(this.translateColour(properties.strokeColour));
    }

    updateText(id: string, properties: RenderedText): void {
        if (id == undefined) return;
        let textToUpdate: wt2Text = this.wt2Shapes[parseInt(id)]

        if (properties.pos != undefined) textToUpdate.setPosition(this.translateCoordinates(properties.pos));
        if (properties.colour != undefined) textToUpdate.setColour(this.translateColour(properties.colour));
        if (properties.text != undefined) textToUpdate.setText(properties.text);
    }

    get canvasHeight(): number {
        return this.wt2.windowHeight;
    }

    get canvasWidth(): number {
        return this.wt2.windowWidth;
    }

    translateCoordinates(inCoords: Coordinate): Coordinate {
        let newX = inCoords.x;
        let newY = inCoords.y;

        //Scale by factor of 40
        newX *= 1/20;
        newY *= 1/20;

        //Flip Y
        newY *= -1;

        //Translate to origin
        newX -= (this.wt2.windowWidth/(40));
        newY += (this.wt2.windowHeight/(40));

        return new Coordinate(newX, newY);
    }

    translateGrid(inCoords: Coordinate, boxWidth: number, boxHeight: number, boxRadius: number): gridPosInfo {
        return  {
            pos: this.translateCoordinates(inCoords),
            boxWidth: boxWidth/20,
            boxHeight: boxHeight/20,
            boxRadius: boxRadius/20,
        }
    }

    translateRect(inCoords: Coordinate, width: number, height: number, radius: number, borWid: number): rectPosInfo {
        return {
            pos: this.translateCoordinates(inCoords),
            width: width/20,
            height: height/20,
            radius: radius/20,
            borWid: borWid/20
        }
    }

    translateText(inCoords: Coordinate, height: number): textPosInfo {
        return {
            pos: this.translateCoordinates(inCoords),
            height: height/20,
        }
    }

    translateColour(colour: Colour): THREE.Color {
        return new THREE.Color(colour.r/255, colour.g/255, colour.b/255);
    }

    translateColourGrid(grid: number[][], transparentIsZero?: boolean): Color[][] {
        let colourGrid: Color[][] = [];
        for (let i: number = 0; i < grid.length; i++) {
            colourGrid[i] = [];
            for (let j: number = 0; j < grid[i].length; j++) {
                if (transparentIsZero && grid[i][j] == 0) {
                    colourGrid[i][j] = undefined;
                } else {
                    colourGrid[i][j] = this.translateColour(this.getRGBFromBrickColID(grid[i][j]));
                }
            }
        }
        return colourGrid;
    }

    getRGBFromBrickColID(colNo: number): Colour {
        switch (colNo) {
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