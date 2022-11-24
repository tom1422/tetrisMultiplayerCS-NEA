import GridRenderer from "./SpecificRenderers/GridRenderer";
import * as p5 from "p5";
import BackgroundManager from "./BackgroundManager";
import GridRendererP5 from "./SpecificRenderers/GridRendererP5";
import MenuItemRenderer from "./SpecificRenderers/MenuItemRenderer";
import MenuItemRendererP5 from "./SpecificRenderers/MenuItemRendererP5";
import wumThree2D from "../../three/wumThree2D";
import MenuItemRendererWT2 from "./SpecificRenderers/MenuItemRendererWT2";
import GridRendererWT2 from "./SpecificRenderers/GridRendererWT2";

export default class Renderer {

    sketch: p5;
    wt2: wumThree2D;

    backgroundManager: BackgroundManager;

    abstractRendererUpdateFunctions: Function[] = [];

    onWindowResize: Function[] = [];

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
            this.sketch = p5;
        } else if (wt2 != undefined) {
            this.wt2 = wt2;
        }

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

        //On window resize function
        window.addEventListener('resize',()=>{this.onWindowResize.forEach((value)=>{value();})});
    }

    update(): void {
        if (this.sketch != undefined) {
            this.backgroundManager.update();
            this.sketch.fill(255, 204 ,0);
            this.sketch.circle(20, 20, 300);
        }
    }

    makeMenuItemRenderer(): MenuItemRenderer {
        let set = undefined;
        if (this.sketch != undefined) {
            set = new MenuItemRendererP5(this.sketch);
        } else if (this.wt2 != undefined) {
            set = new MenuItemRendererWT2(this.wt2);
        }
        this.abstractRendererUpdateFunctions.push(set.getUpdateLoop());
        return set;
    }

    makeGridRenderer(): GridRenderer {
        let set = undefined;
        if (this.sketch != undefined) {
            set = new GridRendererP5(this.sketch);
        } else if (this.wt2 != undefined) {
            set = new GridRendererWT2(this.wt2);
        }
        this.abstractRendererUpdateFunctions.push(set.getUpdateLoop());
        return set;
    }
}