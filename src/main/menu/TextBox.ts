import MenuItem from "./MenuItem";
import * as p5 from "p5";
import Observer from "../userinput/KeyUpdateObserverInterface";
import InputManagerSubjectInterface from "../userinput/InputManagerSubjectInterface";
import InputManagerSubject from "../userinput/InputManagerSubject";
import Colour from "../other/Colour";
import ClickerComponent from "./reusable/ClickerComponent";
import KeyBurst from "../userinput/KeyBurst";
import MenuItemRenderer from "../renderer/SpecificRenderers/MenuItemRenderer";
import Coordinate from "../other/Coordinate";

export default class TextBox implements MenuItem, Observer {

    private menuItemRenderer: MenuItemRenderer;
    private width: number;
    private weight: number;
    private bgText: string;
    private currentText: string = "";
    private fontSize: number;
    private font: string;
    public height: number;
    public onAscButtonPress: Function; //Called by this class, passes in text in the textbox

    private highlighted: boolean = false;
    private textCol: Colour = new Colour(0, 0, 0);
    private altTextCol: Colour = new Colour(80, 80, 80);
    private defaultColour: Colour = new Colour(210, 210, 210);
    private highlightedColour: Colour = new Colour(23, 210, 180);

    private clickerComponent: ClickerComponent;
    private keyBurstProvider: KeyBurst;

    private graphicTextID: string;
    private graphicBoxID: string;

    private xPos: number = 0;
    private yPos: number = 0;

    constructor(menuItemRenderer: MenuItemRenderer, bgText: string, width: number, height: number, weight: number, inputManager: InputManagerSubject, fontSize: number, font: string, onAscButtonPress: Function) {
        this.menuItemRenderer = menuItemRenderer;
        this.bgText = bgText;
        this.width = width;
        this.height = height;
        this.weight = weight;
        this.fontSize = fontSize;
        this.font = font;
        this.onAscButtonPress = onAscButtonPress;
        inputManager.attach(this);
        this.clickerComponent = new ClickerComponent(menuItemRenderer, width, height);
        this.keyBurstProvider = new KeyBurst(this.keyBurst.bind(this));

        this.createBox(20, 20);
        this.createText(20 ,20)
    }

    createBox(xPos: number, yPos: number): void {
        this.graphicBoxID = this.menuItemRenderer.createRectangle({
            pos: new Coordinate((xPos)-(this.width/2), yPos),
            width: this.width,
            height: this.height,
            radius: 10,
            colour: this.defaultColour,
            strokeColour: new Colour(0, 0, 0)
        });
    }
    createText(xPos: number, yPos: number): void {
        this.graphicTextID = this.menuItemRenderer.createText({
            text: this.bgText,
            pos: new Coordinate((xPos+10)-(this.width/2), (yPos + (this.height/2)),),
            fontSize: this.fontSize,
            textAlign: 0,
            fontName: "Trebuchet MS",
            colour: this.altTextCol,
            strokeColour: undefined,
        });
    }

    update(): boolean {
        this.keyBurstProvider.update();
        this.checkClick(this.xPos, this.yPos);
        this.menuItemRenderer.drawThisFrame();

        return true;
    }

    setPosition(xPos: number, yPos: number): void {
        this.xPos = xPos;
        this.yPos = yPos;
        this.menuItemRenderer.updateText(this.graphicTextID, {
            pos: new Coordinate((xPos + 10) - (this.width/2), (yPos + (this.height / 2))),
        });
        this.menuItemRenderer.updateRectangle(this.graphicBoxID, {
            pos: new Coordinate((xPos) - (this.width / 2), yPos),
        });
    }

    updateBoxCol() {
        let boxCol = this.defaultColour;
        if (this.highlighted) {
            boxCol = this.highlightedColour;
        }
        this.menuItemRenderer.updateRectangle(this.graphicBoxID, {
            colour: boxCol,
        });
    }

    updateTextInBox() {
        let curTextCol: Colour = this.textCol;
        let textToShow: string = this.currentText;
        if (textToShow.length == 0) {
            textToShow = this.bgText;
            curTextCol = this.altTextCol;
        }
        this.menuItemRenderer.updateText(this.graphicTextID, {
            text: textToShow,
            colour: curTextCol,
        });
    }

    private linkButton():void {
        //This gets called when the associated button is pressed.
        this.onAscButtonPress(this.currentText);
    }

    getLinkButtonMethod(): Function {
        return this.linkButton.bind(this);
    }

    keyPress(subject: InputManagerSubjectInterface): void {
        this.keyBurstProvider.keyDown(subject.keyPressed);
        this.keyUpdate(subject.keyPressed);
    }

    keyRelease(subject: InputManagerSubjectInterface): void {
        this.keyBurstProvider.keyUp(subject.keyReleased);
    }

    keyBurst() {
        this.keyUpdate(this.keyBurstProvider.keyPressed);
    }

    keyUpdate(keyProvided: string) {
        if (!this.highlighted) return;
        let strLen = this.currentText.length;
        let key = keyProvided;
        let keyLow = keyProvided.toLowerCase();
        console.log(key);
        if (keyLow == "backspace") {
            if (strLen > 0) {
                this.currentText = this.currentText.substring(0, strLen - 1);
            }
        }
        let alphabet: string = "abcdefghijklmnopqrstuvwxyz";
        let numbers: string = "1234567890";
        if (numbers.includes(keyLow) || alphabet.includes(keyLow)) {
            this.currentText += keyProvided;
        }
        //Update attributes now
        this.updateTextInBox()
    }

    public checkClick(xPos: number, yPos: number): void {
        this.clickerComponent.update((xPos) - (this.width / 2), yPos);
        if (this.clickerComponent.wentUp) {
            if (this.clickerComponent.wentDownInBox && this.clickerComponent.hovered) {
                //Clicked fully so select
                this.highlighted = true;
            } else {
                //Clicked or released outside so deselect
                this.highlighted = false;
            }
            //Update attributes now
            this.updateBoxCol();
        }
    }
}

