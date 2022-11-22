import * as p5 from "p5";

export default class BackgroundManager {

    sketch: p5;
    three2D: any;
    bgNumber: number = 0;

    imagesP5: p5.Image[] = [];

    lastChange: number;

    constructor(p5?: p5, three2D?: any) {
        this.sketch = p5;
        this.three2D = three2D;

        this.lastChange = Date.now();

        if (this.sketch != undefined) {
            this.imagesP5.push(this.sketch.loadImage("assets/bg0.jpg"));
            this.imagesP5.push(this.sketch.loadImage("assets/bg1.jpg"));
            this.imagesP5.push(this.sketch.loadImage("assets/bg2.jpg"));
        }
    }

    update(): void {
        if (this.sketch != undefined) {
            if (Date.now() - this.lastChange > 10000) {
                this.bgNumber = (this.bgNumber + 1) % 2;
                this.lastChange = Date.now();
            }
            this.sketch.background(this.imagesP5[this.bgNumber]);
            this.sketch.fill("rgba(231,231,231,0.87)");
            this.sketch.rect(0, 0, this.sketch.width, this.sketch.height);
        }
    }

}