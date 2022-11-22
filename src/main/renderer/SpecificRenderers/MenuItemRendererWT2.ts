import MenuItemRenderer, {RenderedLine, RenderedRectangle, RenderedText} from "./MenuItemRenderer";
import * as p5 from "p5";
import wumThree2D from "../../../three/wumThree2D";
import wt2Rect from "../../../three/renderedObjects/wt2Rect";
import wt2Text from "../../../three/renderedObjects/wt2Text";
import * as THREE from "three";

export default class MenuItemRendererWT2 implements MenuItemRenderer {

    wt2: wumThree2D;
    visible: boolean = true;
    updatedThisFrame: boolean = false;

    items: any[] = [];
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
        properties.isRect = true;
        let index: number = this.items.push(properties)-1;
        let rect = new wt2Rect(this.wt2.renderer);
        rect.make(properties.x, properties.y, properties.radius, properties.width, properties.height, properties.colour, properties.radius, properties.strokeColour);
        rect.setColour(new THREE.Color(properties.colour.r/255, properties.colour.g/255, properties.colour.b/255), new THREE.Color(properties.strokeColour.r/255, properties.strokeColour.g/255, properties.strokeColour.b/255))
        this.wt2Shapes[index] = rect;
        return (index).toString();
    }

    createText(properties: RenderedText): string {
        properties.isText = true;
        let index: number = this.items.push(properties)-1;
        let text = new wt2Text(this.wt2.renderer);
        text.make(properties.x, properties.y, properties.fontSize, properties.text, this.wt2.renderer.fonts[0], properties.textAlign);
        text.setColour(new THREE.Color(properties.colour.r/255, properties.colour.g/255, properties.colour.b/255));
        this.wt2Shapes[index] = text;
        return (index).toString();
    }

    updateLine(id: string, properties: RenderedLine): void {
        if (id == undefined) return;
    }

    updateRectangle(id: string, properties: RenderedRectangle): void {
        if (id == undefined) return;
        let rectToUpdate: wt2Rect = this.wt2Shapes[parseInt(id)]

        rectToUpdate.setPosition(properties.x, properties.y);
        if (properties.colour != undefined) rectToUpdate.setColour(new THREE.Color(properties.colour.r/255, properties.colour.g/255, properties.colour.b/255), undefined);
        if (properties.strokeColour != undefined) rectToUpdate.setColour(undefined, new THREE.Color(properties.strokeColour.r/255, properties.strokeColour.g/255, properties.strokeColour.b/255));
    }

    updateText(id: string, properties: RenderedText): void {
        if (id == undefined) return;
        let textToUpdate: wt2Text = this.wt2Shapes[parseInt(id)]

        textToUpdate.setPosition(properties.x, properties.y);
        if (properties.colour != undefined) textToUpdate.setColour(new THREE.Color(properties.colour.r/255, properties.colour.g/255, properties.colour.b/255));

    }

    get mouseButton(): string {
        return "";
    }

    get mouseIsPressed(): boolean {
        return false;
    }

    get mouseX(): number {
        return 0;
    }

    get mouseY(): number {
        return 0;
    }

}