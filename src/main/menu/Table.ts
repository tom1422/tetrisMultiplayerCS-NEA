import MenuItem from "./MenuItem";
import * as p5 from "p5";
import MenuItemRenderer from "../renderer/SpecificRenderers/MenuItemRenderer";

export default class Table implements MenuItem {

    private menuItemRenderer: MenuItemRenderer;
    private menuItems: any = []; //Row, Col (y, x)

    private gridWidth: number;
    private gridHeight: number;

    private cellWidth: number = 50;
    private cellHeight: number = 30;

    public height: number = 0;
    private heightSame: boolean = true;

    private xPos: number = 0;
    private yPos: number = 0;

    constructor(menuItemRenderer: MenuItemRenderer, width: number, height: number, cellWidth: number, cellHeight: number, menuItems?: any) {
        if (typeof menuItems !== 'undefined') {
            this.menuItems = menuItems;
        } else {
            for (let i: number = 0; i < height; i++) {
                this.menuItems[i] = [];
            }
        }
        this.menuItemRenderer = menuItemRenderer.make();
        this.gridWidth = width;
        this.cellWidth = cellWidth;
        this.cellHeight = cellHeight;
        this.gridHeight = height;
    }

    lastXPos: number = 0;
    lastYPos: number = 0;

    setPosition(xPos: number, yPos: number): void {
        this.xPos = xPos;
        this.yPos = yPos;
        this.regenerateLayoutAndChildren();
    }

    update(): boolean {
        this.menuItemRenderer.drawThisFrame();

        //Update all cells
        for (let i: number = 0; i < this.gridHeight; i++) {
            for (let j: number = 0; j < this.gridWidth; j++) {
                let item: MenuItem = this.menuItems[i][j];
                if (item !== undefined) {
                    item.update();
                }
            }
        }

        if (!this.heightSame) {
            this.heightSame = true;
            return false;
        }
        return true;
    }

    regenerateLayoutAndChildren() {
        //Delete all previous outlines (if there are any)
        this.menuItemRenderer.clearObjects();
        const yPos = this.yPos;
        const xPos = this.xPos;

        this.height = this.cellHeight * this.gridHeight;
        let yOffset: number = yPos;
        for (let i: number = 0; i < this.gridHeight; i++) {
            //Center element should have midpoint = xPos
            let xOffset: number = xPos - (((this.gridWidth-1) * this.cellWidth)/2);
            for (let j: number = 0; j < this.gridWidth; j++) {
                let item: MenuItem = this.menuItems[i][j];
                let xTmp = xOffset;
                if (item !== undefined) {
                    if (item.align == 0) {
                        xTmp -= this.cellWidth/2;
                    } else if (item.align == 2) {
                        xTmp += this.cellWidth/2;
                    }
                    item.setPosition(xTmp, yOffset);
                }
                //this.createOutline(xOffset, yOffset, this.cellWidth, this.cellHeight);
                xOffset += this.cellWidth;
            }
            yOffset += this.cellHeight;
        }
    }

    createOutline(xMidpoint: number, top: number, w: number, h: number) {
        let x = xMidpoint - (w/2);
        let y = top;
        this.menuItemRenderer.createLine({
            x1: x,
            y1: y,
            x2: x+w,
            y2: y,
        });
        this.menuItemRenderer.createLine({
            x1: x+w,
            y1: y,
            x2: x+w,
            y2: y+h,
        });
        this.menuItemRenderer.createLine({
            x1: x,
            y1: y+h,
            x2: x+w,
            y2: y+h,
        });
        this.menuItemRenderer.createLine({
            x1: x,
            y1: y,
            x2: x,
            y2: y+h,
        });
    }


    addMenuItem(row:number, col:number, item: MenuItem) {
        this.menuItems[row][col] = item;
        //Update layout
        this.regenerateLayoutAndChildren();
        //Update height property - TELL MENU_SCREEN TO RECALCULATE OTHER CLASSES HEIGHTS
        this.heightSame = false;
    }

    resize(newSize: number) {
        for (let i: number = this.gridHeight; i < newSize; i++) {
            this.menuItems[i] = [];
        }
        this.gridHeight = newSize;
    }

}