import MenuItemRenderer, {RenderedLine, RenderedRectangle, RenderedText} from "./MenuItemRenderer";
import * as p5 from "p5";
import wumThree2D from "../../../three/wumThree2D";
import wt2Rect, {rectPosInfo} from "../../../three/renderedObjects/wt2Rect";
import wt2Text, {textPosInfo} from "../../../three/renderedObjects/wt2Text";
import * as THREE from "three";
import Coordinate from "../../other/Coordinate";
import Colour from "../../other/Colour";

export default class MenuItemRendererWT2 implements MenuItemRenderer {

    wt2: wumThree2D;
    visible: boolean = true;
    updatedThisFrame: boolean = false;

    wt2Shapes: any[] = [];

    constructor(wt2: wumThree2D) {
        this.wt2 = wt2;
    }

    updateLoop() {
        if (this.updatedThisFrame) {
            this.updatedThisFrame = false;
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
        this.updatedThisFrame = true;
    }

    createLine(properties: RenderedLine): string {
        return undefined;
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

    updateLine(id: string, properties: RenderedLine): void {
        if (id == undefined) return;
    }

    updateRectangle(id: string, properties: RenderedRectangle): void {
        if (id == undefined) return;
        let rectToUpdate: wt2Rect = this.wt2Shapes[parseInt(id)]
        console.log("updaing a rectangle", properties)

        if (properties.pos != undefined) rectToUpdate.setPosition(this.translateCoordinates(properties.pos));
        if (properties.colour != undefined) rectToUpdate.setColour(this.translateColour(properties.colour));
        if (properties.strokeColour != undefined) rectToUpdate.setStrokeColour(this.translateColour(properties.strokeColour));
    }

    updateText(id: string, properties: RenderedText): void {
        if (id == undefined) return;
        let textToUpdate: wt2Text = this.wt2Shapes[parseInt(id)]

        if (properties.pos != undefined) textToUpdate.setPosition(this.translateCoordinates(properties.pos));
        if (properties.colour != undefined) textToUpdate.setColour(this.translateColour(properties.colour));

    }

    get mouseButton(): string {
        return "left";
    }

    get mouseIsPressed(): boolean {
        return this.wt2.mousePressed;
    }

    get mouseX(): number {
        return this.wt2.mouseX;
    }

    get mouseY(): number {
        return this.wt2.mouseY;
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

}