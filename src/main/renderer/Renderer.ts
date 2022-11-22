import GridRenderer from "./SpecificRenderers/GridRenderer";
import * as p5 from "p5";
import BackgroundManager from "./BackgroundManager";
import GridRendererP5 from "./SpecificRenderers/GridRendererP5";
import MenuItemRenderer from "./SpecificRenderers/MenuItemRenderer";
import MenuItemRendererP5 from "./SpecificRenderers/MenuItemRendererP5";
import wumThree2D from "../../three/wumThree2D";

export default class Renderer {

    sketch: p5;
    wt2: wumThree2D;

    gridRenderer: GridRenderer;
    menuItemRenderer: MenuItemRenderer;
    backgroundManager: BackgroundManager;

    abstractRendererUpdateFunctions: Function[] = [];
    font: any[] = [];

    get width() {
        if (this.sketch != undefined) {
            return this.sketch.width;
        }
        if (this.wt2 != undefined) {
            return this.wt2.windowWidth;
        }
        return 0;
    }

    constructor(p5?: p5, wt2?: wumThree2D) {
        if (p5 != undefined) {
            this.gridRenderer = new GridRendererP5(p5, this);
            this.menuItemRenderer = new MenuItemRendererP5(p5, this);
            this.sketch = p5;
        } else if (wt2 != undefined) {
            // this.gridRenderer = new GridRendererP5(p5, this);
            // this.menuItemRenderer = new MenuItemRendererP5(p5, this);
            this.wt2 = wt2;
        }

        this.abstractRendererUpdateFunctions.push(this.gridRenderer.getUpdateLoop());
        this.abstractRendererUpdateFunctions.push(this.menuItemRenderer.getUpdateLoop());

        this.backgroundManager = new BackgroundManager(p5, wt2);

        this.font[0] = "1up";
        this.font[1] = "soopafre";
        this.font[2] = "Trebuchet MS";

        if (p5 != undefined) {
            this.sketch.createCanvas(
                this.sketch.windowWidth,
                this.sketch.windowHeight,
                this.sketch.P2D);
            this.sketch.windowResized = () => {
                this.sketch.resizeCanvas(this.sketch.windowWidth, this.sketch.windowHeight);
            };
        }
        if (this.wt2 != undefined) {
            //Create canvas ETC
        }
    }

    update(): void {
        if (p5 != undefined) {
            this.backgroundManager.update();
            this.sketch.fill(255, 204 ,0);
            this.sketch.circle(20, 20, 300);
        }
    }

    makeMenuItemRendererP5(): MenuItemRendererP5 {
        const set = new MenuItemRendererP5(this.sketch);
        this.abstractRendererUpdateFunctions.push(set.getUpdateLoop());
        return set;
    }

    makeGridRendererP5(): GridRendererP5 {
        const set = new GridRendererP5(this.sketch);
        this.abstractRendererUpdateFunctions.push(set.getUpdateLoop);
        return set;
    }
}