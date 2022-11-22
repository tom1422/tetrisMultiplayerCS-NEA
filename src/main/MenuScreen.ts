import * as p5 from "p5";
import Button from "./menu/Button";
import TetrisGame from "./TetrisGame";
import Renderer from "./renderer/Renderer";
import MenuItem from "./menu/MenuItem";
import InputManagerSubject from "./userinput/InputManagerSubject";

export default class MenuScreen {

    screenType: number = 1;
    elementStartHeight: number = 25;
    menuItems: any = [];

    renderer: Renderer;
    lastWidth: number = 0;

    constructor(renderer: Renderer) {
        for (let i: number = 0; i < 7; i++) {
            this.menuItems[i] = [];
        }
        this.renderer = renderer;
    }

    public updateMenuItemPositions(): void {
        for (let i: number = 0; i < this.menuItems.length; i++) {
            let curHeight: number = this.elementStartHeight;
            let xPos: number = this.renderer.width / 2;
            this.menuItems[i].forEach(function(button: MenuItem) {
                button.setPosition(xPos, curHeight);
                curHeight += button.height + 50;
            });
        }
    }

    public update(): void {
        if (this.renderer.width !== this.lastWidth) {
            this.lastWidth = this.renderer.width;
            this.updateMenuItemPositions();
        }
        this.menuItems[this.screenType].forEach((button: MenuItem) => {
            if (!button.update()) {
                this.updateMenuItemPositions();
            }
        });
    }

    public registerItem(menu: number, button: MenuItem) {
        this.menuItems[menu].push(button);
        this.updateMenuItemPositions();
    }

    getMenuItems(screen: number) {
        return this.menuItems[screen];
    }

}