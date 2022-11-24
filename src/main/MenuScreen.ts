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
    resized: boolean = false;

    constructor(renderer: Renderer) {
        for (let i: number = 0; i < 7; i++) {
            this.menuItems[i] = [];
        }
        this.renderer = renderer;
        this.renderer.onWindowResize.push(this.windowResize.bind(this));
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

    windowResize(): void {
        this.resized = true;
    }

    public update(): void {
        if (this.resized) {
            this.updateMenuItemPositions();
            this.resized = false;
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