//Class for the actual tetris game (main game)

import * as p5 from "p5";
import Renderer from "./renderer/Renderer";
import TetrisGrid from "./TetrisGrid";
import KeyboardInputP5 from "./userinput/KeyboardInputP5";
import InputManagerSubject from "./userinput/InputManagerSubject";
import Brick from "./brick/Brick";
import GridVisual from "./GridVisual";
import GridManager from "./GridManager";
import MenuScreen from "./MenuScreen";
import Button from "./menu/Button";
import Text from "./menu/Text";
import Colour from "./other/Colour";
import TextBox from "./menu/TextBox";
import Table from "./menu/Table";
import Multiplayer from "./networked/Multiplayer";
import MenuScreenCommunicator from "./networked/communicators/MenuScreenCommunicator";
import MultiplayerVisual from "./networked/MultiplayerVisual";
import GameSettings from "./GameSettings";
import MenuItem from "./menu/MenuItem";
import MenuItemRenderer from "./renderer/SpecificRenderers/MenuItemRenderer";
import wumThree2D from "../three/wumThree2D";
import KeyboardInputWT2 from "./userinput/KeyboardInputWT2";

export default class tetrisGame {
    rendererClass: Renderer;
    inputManager: InputManagerSubject;

    menuScreen: MenuScreen;

    tetrisGrid: TetrisGrid;
    gridManager: GridManager;
    gridVisual: GridVisual;

    multiplayerManager: Multiplayer;

    gameSettings: GameSettings;

    constructor(p5?: p5, wt2?: wumThree2D) {
        if (p5 != undefined) {
            console.log("P5.js stock renderer")
            this.inputManager = new InputManagerSubject(new KeyboardInputP5(p5));
            this.rendererClass = new Renderer(p5);
        } else if (wt2 != undefined) {
            console.log("Three js custom renderer")
            this.inputManager = new InputManagerSubject(new KeyboardInputWT2(wt2));
            this.rendererClass = new Renderer(undefined, wt2);
        }
        this.gameSettings = new GameSettings();
        this.multiplayerManager = new Multiplayer(this.startMultiplayerGame.bind(this), this.endMultiplayerGame.bind(this));
        this.menuScreen = new MenuScreen(this.rendererClass);
        this.multiplayerManager.menuScreenTalker = new MenuScreenCommunicator(this.multiplayerManager, this.menuScreen);
        this.menuScreenSetup();
    }

    update():void {
        this.rendererClass.update();
        if (this.gridManager !== undefined) {
            this.gridManager.update();
        }
        if (this.gridVisual !== undefined) {
            this.gridVisual.update();
        }
        if (this.multiplayerManager.multiplayerVisual !== undefined) {
            this.multiplayerManager.multiplayerVisual.draw();
        }
        this.menuScreen.update();

        //Call after updating positions of menu screen
        this.rendererClass.abstractRendererUpdateFunctions.forEach((updateLoop: Function) => {updateLoop()});
    }

    //Everything past here is menu screen related

    menuScreenSetup(): void {
        this.m1();
        this.m2();
        this.m3();
        this.m5();
    }

    m1() {
        this.menuScreen.registerItem(1, new Text(this.rendererClass.makeMenuItemRenderer(), "Tetris Game", 30, new Colour(0, 0, 0), 2,1, this.rendererClass.font[0]));
        this.menuScreen.registerItem(1, new Button(this.rendererClass.makeMenuItemRenderer(), "Start New Game", 220, 50, 2, this.startGame.bind(this)));
        this.menuScreen.registerItem(1, new Button(this.rendererClass.makeMenuItemRenderer(), "Multiplayer", 220, 50, 2, () => {this.menuScreen.screenType = 3;}));
        this.menuScreen.registerItem(1, new Button(this.rendererClass.makeMenuItemRenderer(), "Controls/Help", 220, 50, 2, () => {this.menuScreen.screenType = 5;}));
        this.menuScreen.registerItem(1, new Button(this.rendererClass.makeMenuItemRenderer(), "Leaderboards", 220, 50, 2, () => {}));
    }

    m2() {
        this.menuScreen.registerItem(2, new Text(this.rendererClass.makeMenuItemRenderer(), "", 30, new Colour(0, 0, 0), 2, 1, this.rendererClass.font[0]));
        this.menuScreen.registerItem(2, new Button(this.rendererClass.makeMenuItemRenderer(), "Start New Game", 220, 50, 2, this.startGame.bind(this)));
        this.menuScreen.registerItem(2, new Button(this.rendererClass.makeMenuItemRenderer(), "<- Back to main menu", 220, 50, 2, () => {this.resetGame()}));
    }

    m3() {
        this.menuScreen.registerItem(3, new Text(this.rendererClass.makeMenuItemRenderer(), "Multiplayer", 30, new Colour(0, 0, 0), 2, 1, this.rendererClass.font[0]));

        let asda = new TextBox(this.rendererClass.makeMenuItemRenderer(), "username", 220, 50, 2, this.inputManager, 20, this.rendererClass.font[0],
            (username: string) => {this.gameSettings.username = username});
        this.menuScreen.registerItem(3, asda);

        let lobbyIdMenu: Table = new Table(this.rendererClass.makeMenuItemRenderer(), 3, 1, 220, 50);
        let textBox = new TextBox(this.rendererClass.makeMenuItemRenderer(), "lobby id", 220, 50, 2, this.inputManager, 20, this.rendererClass.font[0],
            (lobbyId: string) => {this.multiplayerManager.joinLobby(this.gameSettings, lobbyId);});
        lobbyIdMenu.addMenuItem(0, 1, textBox);

        let subTable1: Table = new Table(this.rendererClass.makeMenuItemRenderer(), 4, 1, 55, 50);
        subTable1.addMenuItem(0, 0, new Button(this.rendererClass.makeMenuItemRenderer(), "-->", 55, 50, 2, () => {
            asda.getLinkButtonMethod()();
            textBox.getLinkButtonMethod()();
        }));
        lobbyIdMenu.addMenuItem(0, 2, subTable1);
        this.menuScreen.registerItem(3, lobbyIdMenu);

        this.menuScreen.registerItem(3, new Button(this.rendererClass.makeMenuItemRenderer(), "Host New Lobby", 220, 50, 2, () => {
            asda.getLinkButtonMethod()();
            this.multiplayerManager.joinLobby(this.gameSettings);}));

        this.menuScreen.registerItem(3, new Button(this.rendererClass.makeMenuItemRenderer(), "<- Back to main menu", 220, 50, 2, this.resetGame.bind(this)));
    }

    m5() {
        this.menuScreen.registerItem(5, new Text(this.rendererClass.makeMenuItemRenderer(), "Controls, Help", 30, new Colour(0, 0, 0), 2, 1, this.rendererClass.font[0]));

        this.menuScreen.registerItem(5, new Text(this.rendererClass.makeMenuItemRenderer(), "Specify alternate binds below, default ones are shown in brackets:", 15, new Colour(0, 0, 0), 2, 1, this.rendererClass.font[1]));


        let lobbyIdMenu: Table = new Table(this.rendererClass.makeMenuItemRenderer(), 2, 1, 275, 50);
        lobbyIdMenu.addMenuItem(0, 0, this.getRow( "rotate (w, uparr)", (bind: string) => {this.gameSettings.rotatebind = bind}));
        lobbyIdMenu.addMenuItem(0, 1, this.getRow( "down (s, downarr)", (bind: string) => {this.gameSettings.downbind = bind}));


        let lobbyIdMenu2: Table = new Table(this.rendererClass.makeMenuItemRenderer(), 2, 1, 275, 50);
        lobbyIdMenu2.addMenuItem(0, 0, this.getRow( "right (d, rightarr)", (bind: string) => {this.gameSettings.rightbind = bind}));
        lobbyIdMenu2.addMenuItem(0, 1, this.getRow( "left (a, leftarr)", (bind: string) => {this.gameSettings.leftbind = bind}));

        let lobbyIdMenu3: Table = new Table(this.rendererClass.makeMenuItemRenderer(), 2, 1, 275, 50);
        lobbyIdMenu3.addMenuItem(0, 0, this.getRow( "save (v)", (bind: string) => {this.gameSettings.savebind = bind}));
        lobbyIdMenu3.addMenuItem(0, 1, this.getRow( "place (space)", (bind: string) => {this.gameSettings.placebind = bind}));

        this.menuScreen.registerItem(5, lobbyIdMenu);
        this.menuScreen.registerItem(5, lobbyIdMenu2);
        this.menuScreen.registerItem(5, lobbyIdMenu3);

        this.menuScreen.registerItem(5, new Button(this.rendererClass.makeMenuItemRenderer(), "<- Back to main menu", 220, 50, 2, this.resetGame.bind(this)));
    }

    getRow(text: string, callback: Function): Table {
        let lobbyIdMenu: Table = new Table(this.rendererClass.makeMenuItemRenderer(), 3, 1, 220, 50);
        let textBox2 = new TextBox(this.rendererClass.makeMenuItemRenderer(), text, 220, 50, 2, this.inputManager, 20, this.rendererClass.font[0], callback);
        lobbyIdMenu.addMenuItem(0, 1, textBox2);

        let subTable1: Table = new Table(this.rendererClass.makeMenuItemRenderer(), 4, 1, 55, 50);
        subTable1.addMenuItem(0, 0, new Button(this.rendererClass.makeMenuItemRenderer(), "-->", 55, 50, 2, textBox2.getLinkButtonMethod()));
        lobbyIdMenu.addMenuItem(0, 2, subTable1);
        return lobbyIdMenu;
    }

    public startGame(): void {
        //Callback to initiate the start of the game
        this.tetrisGrid = new TetrisGrid(10, 14);
        this.gridManager = new GridManager(this.tetrisGrid, this.inputManager, this.gameSettings, () => {this.menuScreen.screenType = 2;});
        this.gridVisual = new GridVisual(this.tetrisGrid, this.rendererClass.makeGridRenderer(), this.rendererClass);

        this.gridManager.dispenseNewBrick();

        this.menuScreen.screenType = 0;
    }

    public startMultiplayerGame(tetrisGrid: TetrisGrid): void {
        this.gridManager = new GridManager(tetrisGrid, this.inputManager, this.gameSettings, () => {console.log("multiplayer game over!!!")});
        //Pass the user's grid to the multiplayer renderer:
        this.gridManager.dispenseNewBrick();
        this.multiplayerManager.multiplayerVisual = new MultiplayerVisual(this.multiplayerManager.lobby, this.rendererClass, new GridVisual(tetrisGrid, this.rendererClass.makeGridRenderer(), this.rendererClass));
        this.multiplayerManager.multiplayerVisual.setup();
    }

    public endMultiplayerGame(menu: boolean): void {
        this.inputManager.detach(this.gridManager)
        this.gridManager = undefined;
        if (menu) {
            this.menuScreen.screenType = 6;
        } else {
            this.multiplayerManager.multiplayerVisual = undefined;
        }
    }

    public resetGame(): void {
        this.tetrisGrid = undefined;
        this.gridManager = undefined;
        this.gridVisual = undefined;
        this.menuScreen.screenType = 1;
    }
}
