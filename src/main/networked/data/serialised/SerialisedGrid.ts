import TetrisGrid from "../../../TetrisGrid";
import MultiplayerGame from "../MultiplayerGame";
import SerialisedBrick from "./SerialisedBrick";
import Brick from "../../../brick/Brick";

export default class SerialisedGrid {

    gridArray: number[][]; //Arranged like x, y
    score: number = 0;
    eliminated: boolean = false;

    //brick details
    brick: SerialisedBrick;
    nextBrick: SerialisedBrick;
    savedBrick: SerialisedBrick;

    constructor(grid: TetrisGrid, serialisedGrid?: SerialisedGrid) {
        //Constructing means sending to server - only send bare minimum
        if (serialisedGrid != undefined) {
            this.gridArray = serialisedGrid.gridArray;
            this.score = serialisedGrid.score;
            if (serialisedGrid.brick != undefined) this.brick = new SerialisedBrick(undefined, serialisedGrid.brick);
            if (serialisedGrid.nextBrick != undefined) this.nextBrick = new SerialisedBrick(undefined, serialisedGrid.nextBrick);
            if (serialisedGrid.savedBrick != undefined) this.savedBrick = new SerialisedBrick(undefined, serialisedGrid.savedBrick);
            this.eliminated = serialisedGrid.eliminated;
        } else {
            this.gridArray = grid.gridArray;
            this.score = grid.score;
            if (grid.currentBrick != undefined) this.brick = new SerialisedBrick(grid.currentBrick);
            if (grid.nextBrick != undefined) this.nextBrick = new SerialisedBrick(grid.nextBrick);
            if (grid.savedBrick != undefined) this.savedBrick = new SerialisedBrick(grid.savedBrick);
            this.eliminated = grid.eliminated;
        }
    }


    public deserialise(): TetrisGrid {
        let grid = new TetrisGrid(this.gridArray.length, this.gridArray[0].length);
        grid.gridArray = this.gridArray;
        grid.score = this.score;
        if (this.brick != undefined) grid.currentBrick = this.brick.deserialise();
        if (this.nextBrick != undefined) grid.nextBrick = this.nextBrick.deserialise();
        if (this.savedBrick != undefined) grid.savedBrick = this.savedBrick.deserialise();
        grid.eliminated = this.eliminated;
        return grid;
    }

}