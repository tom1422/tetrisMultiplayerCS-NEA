//Class to display the tetris grid

import Brick from "./brick/Brick";

export default class TetrisGrid {
    //Updated properties of this: Updates to the object
    gridArray: number[][]; //Arranged like x, y
    score: number = 0;

    //Updated properties of the following: The whole object, Location of the object
    currentBrick: Brick;
    nextBrick: Brick;
    savedBrick: Brick;

    username: string = "You";
    eliminated: boolean = false;

    sendNetworkUpdateGameState: Function;
    sendVisualUpdate: Function;

    constructor(width: number, height: number) {
        this.gridArray = [];
        for (let i: number = 0; i < width; i++) {
            this.gridArray[i] = [];
            for (let j: number = 0; j < height; j++) {
                this.gridArray[i][j] = 0;
            }
        }
    }

    updateGameState() {
        this.updateRenderedInformation();
        if (this.sendNetworkUpdateGameState == undefined) return;
        this.sendNetworkUpdateGameState();
    }

    updateRenderedInformation() {
        if (this.sendVisualUpdate == undefined) return;
        this.sendVisualUpdate();
    }

}
