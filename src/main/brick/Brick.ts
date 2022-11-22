import RenderedBrick from "./RenderedBrick";
import BrickLocation from "./BrickLocation";

export default class Brick {

    public location: BrickLocation;

    readonly renderedBrick: RenderedBrick;

    readonly brickType: number = 0;
    readonly colour: number = 0;

    constructor() {
        this.brickType = Math.round(Math.random() * 6);
        this.colour = Math.round(Math.random() * 4) + 1;
        this.renderedBrick = new RenderedBrick(this.brickType, this.colour)
        this.location = new BrickLocation(0, 0, 0);
    }

    rotate(amount: number) {
        this.location.rotation += amount
        this.location.rotation = this.location.rotation % 360
        if (this.renderedBrick.limitedRotation) this.location.rotation = this.location.rotation % 180;
    }

    getRotatedBrick(coloured?: boolean) {
        //Make a new empty 4x4 grid
        let newGrid: number[][] = [];
        for (let i: number = 0; i < 4; i++) {
            newGrid[i] = [];
            for (let j: number = 0; j < 4; j++) {
                newGrid[i][j] = 0;
            }
        }

        //"midpoint" should stay the same before and after rotation (same place relative to grid)

        for (let i = 0; i < this.renderedBrick.brickGrid.length; i++) {
            for (let j = 0; j < this.renderedBrick.brickGrid[i].length; j++) {
                if (this.renderedBrick.brickGrid[i][j] != 0) {

                    //Get position relative to midpoint (MP)
                    let x = i - this.renderedBrick.rotationOrigin.x;
                    let y = j - this.renderedBrick.rotationOrigin.y;
                    //Apply rotation
                    let newX = x;
                    let newY = y;
                    if (this.location.rotation == 90) {
                        newX = -y
                        newY = x
                    } else if (this.location.rotation == 180) {
                        newX = -x
                        newY = -y
                    } else if (this.location.rotation == 270) {
                        newX = y
                        newY = -x
                    }
                    //Get new position
                    let finalX = newX + this.renderedBrick.rotationOrigin.x;
                    let finalY = newY + this.renderedBrick.rotationOrigin.y;
                    //Put it in array
                    if ((finalX >= 0 && finalY >= 0) && (finalX < newGrid.length && finalY < newGrid[0].length)) {
                        newGrid[finalX][finalY] = this.renderedBrick.brickGrid[i][j];
                        if (newGrid[finalX][finalY]==1 && coloured) {
                            newGrid[finalX][finalY] = this.colour;
                        }
                    }
                }
            }
        }
        return newGrid;
    }

}