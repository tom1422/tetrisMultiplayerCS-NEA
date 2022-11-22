import MenuItemRenderer, {RenderedLine, RenderedRectangle, RenderedText} from "./MenuItemRenderer";
import * as p5 from "p5";
import wumThree2D from "../../../three/wumThree2D";

export default class MenuItemRendererWT2 implements MenuItemRenderer {

    wt2: wumThree2D;

    constructor(wt2: wumThree2D) {
        this.wt2 = wt2;
    }

    updateLoop() {

    }

    getUpdateLoop(): Function {
        return this.updateLoop.bind(this);
    }

    clearObjects(): void {

    }

    drawThisFrame(): void {

    }

    createLine(properties: RenderedLine): string {
        return "";
    }

    createRectangle(properties: RenderedRectangle): string {
        return "";
    }

    createText(properties: RenderedText): string {
        return "";
    }

    updateLine(id: string, properties: RenderedLine): void {

    }

    updateRectangle(id: string, properties: RenderedRectangle): void {

    }

    updateText(id: string, properties: RenderedText): void {

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