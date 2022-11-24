import GridVisual from "../GridVisual";
import Lobby from "./data/Lobby";
import GridManager from "../GridManager";
import GridRenderer from "../renderer/SpecificRenderers/GridRenderer";
import TetrisGrid from "../TetrisGrid";
import Renderer from "../renderer/Renderer";

export default class MultiplayerVisual {

    gridVisuals: Map<string, GridVisual> = new Map();
    lobby: Lobby;
    renderer: Renderer;
    yourGridVisual: GridVisual;

    constructor(lobby: Lobby, renderer: Renderer, yourGridVisual: GridVisual) {
        this.lobby = lobby;
        this.renderer=renderer;
        this.yourGridVisual = yourGridVisual;
    }

    setup() {
        for (let i: number = 1; i < this.lobby.users.length; i++) {
            this.gridVisuals.set(this.lobby.users[i].userID, new GridVisual(new TetrisGrid(10, 20), this.renderer.makeGridRenderer(), this.renderer));
        }
    }

    draw() {
        //Constants
        const gridWidth: number = 350;
        const windowWidth: number = this.renderer.width;
        const gridsPerLine: number = Math.floor(windowWidth / gridWidth);
        const edgeOverflow: number = windowWidth - (((gridsPerLine < this.lobby.users.length) ? gridsPerLine : this.lobby.users.length) * gridWidth);

        //Variables
        let xOffset: number = edgeOverflow / 2;
        let yOffset: number = 40;
        let currentLine: number = 0;


        for (let i: number = 0; i < this.lobby.users.length; i++) {
            let currentLine = Math.floor(i / gridsPerLine);
            yOffset = currentLine * 400 + 40;
            if (i == 0) {
                this.yourGridVisual.update(xOffset, yOffset);
            } else {
                let userGridVisual = this.gridVisuals.get(this.lobby.users[i].userID);
                userGridVisual.update(xOffset, yOffset);
            }

            xOffset += gridWidth;
            let nextLine = Math.floor((i+1) / gridsPerLine);
            if (nextLine>currentLine)  {
                //Next one is a new line
                xOffset = edgeOverflow/2;
            }
        }
    }

    gridUpdated(player: string) {
        let userGridVisual = this.gridVisuals.get(player);
        if (userGridVisual == undefined) return;

        let userGrid = this.lobby.currentGame.grids.get(player);
        if (userGrid != undefined) {
            userGridVisual.grid = userGrid;
        }

        let asd = this.lobby.users.find((element) => {return element.userID == player;});
        userGridVisual.grid.username = asd.username;
        userGridVisual.updateGameInformation();
    }

}