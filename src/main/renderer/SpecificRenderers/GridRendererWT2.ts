import GridRenderer, {RenderedGrid, RenderedRectangle, RenderedText} from "./GridRenderer";
import * as p5 from "p5";
import wumThree2D from "../../../three/wumThree2D";

export default class GridRendererWT2 implements GridRenderer {

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

    createGrid(properties: RenderedGrid): string {
        return "";
    }

    createRectangle(properties: RenderedRectangle): string {
        return "";
    }

    createText(properties: RenderedText): string {
        return "";
    }

    updateGrid(id: string, properties: RenderedGrid): void {

    }

    updateRectangle(id: string, properties: RenderedRectangle): void {

    }

    updateText(id: string, properties: RenderedText): void {

    }

    get canvasHeight(): number {
        return 0;
    }

    get canvasWidth(): number {
        return 0;
    }

}