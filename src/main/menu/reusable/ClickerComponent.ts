import * as p5 from "p5";
import MenuItemRenderer from "../../renderer/SpecificRenderers/MenuItemRenderer";

export default class ClickerComponent {
    //Should take in p5, some location info, provides mouse info

    wentDown: boolean = false; //Went down this frame
    stayDown: boolean = false;
    wentDownInBox: boolean = false; //Did it go down in the box
    wentUp: boolean = false; //Went up this frame

    hovered: boolean = false;

    menuItemRenderer: MenuItemRenderer;

    width: number = 0;
    height: number = 0;

    constructor(menuItemRenderer: MenuItemRenderer, width: number, height: number) {
        this.menuItemRenderer = menuItemRenderer;
        this.width = width;
        this.height = height;
    }

    public update(xPos: number, yPos: number) {
        this.checkClick(xPos, yPos);
    }

    public checkClick(xPos: number, yPos: number): void {
        this.mouseInBox(xPos, yPos);
        this.mouseEvents(yPos);
        if (this.hovered) {
            //Just hovered
            if (this.stayDown) {
                //Pressed hold
            }
        }
        if (this.wentUp && this.wentDownInBox) {
            if (this.hovered) {
                //Clicked fully ONCE
            }
        }
    }

    public mouseInBox(x: number, y: number): void {
        if (this.menuItemRenderer.mouseX > x && this.menuItemRenderer.mouseY > y) {
            if (this.menuItemRenderer.mouseX < (x + this.width) && (this.menuItemRenderer.mouseY < (y + this.height))) {
                this.hovered = true;
                return;
            }
        }
        this.hovered = false;
    }

    public mouseEvents(yPos: number): void {
        if (this.menuItemRenderer.mouseIsPressed && this.menuItemRenderer.mouseButton == "left") {
            if (this.wentDown) {
                this.wentDown = false;
            } else if (!this.stayDown)  {
                this.wentDown = true;
                this.stayDown = true;
                if (this.hovered) {
                    this.wentDownInBox = true;
                }
            }
        } else {
            //Not being pressed at all
            if (this.stayDown) {
                this.wentUp = true;
                this.stayDown = false;
            } else {
                this.wentUp = false;
                this.wentDownInBox = false;
            }
        }
    }
}