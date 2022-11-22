import Coordinate from "../other/Coordinate";

export default class RenderedBrick {

    brickGrid: number[][];
    colour: number = 1;
    rotationOrigin: Coordinate;
    limitedRotation: boolean = false;

    constructor(brickType: number, colour: number) {
        this.rotationOrigin = new Coordinate(0, 0);
        this.brickGrid = [];


        for(let i: number = 0; i < 4; i++) {
            this.brickGrid[i] = [];
            for(let j: number = 0; j< 4; j++) {
                this.brickGrid[i][j] = 0;
            }
        }

        this.colour = colour;
        this.fillFromID(brickType);
    }

    fillFromID(bricksID: number): void {
        switch(bricksID) {
            case 0:
                //Long Straight TODO: Limit rotation increments
                this.brickGrid[0][1] = 1;
                this.brickGrid[1][1] = 1;
                this.brickGrid[2][1] = 1;
                this.brickGrid[3][1] = 1;
                this.rotationOrigin.set(1, 1)
                this.limitedRotation = true;
                break;
            case 1:
                //Square
                this.brickGrid[0][0] = 1;
                this.brickGrid[0][1] = 1;
                this.brickGrid[1][0] = 1;
                this.brickGrid[1][1] = 1;
                this.rotationOrigin.set(0.5, 0.5);
                break;
            case 2:
                //L shaped brick
                this.brickGrid[1][1] = 1;
                this.brickGrid[2][1] = 1;
                this.brickGrid[2][0] = 1;
                this.brickGrid[0][1] = 1;
                this.rotationOrigin.set(1, 1);
                break;
            case 3:
                //T Shaped brick
                this.brickGrid[1][0] = 1;
                this.brickGrid[1][1] = 1;
                this.brickGrid[1][2] = 1;
                this.brickGrid[2][1] = 1;
                this.rotationOrigin.set(1, 1);
                break;
            case 4:
                //Other L shaped brick
                this.brickGrid[1][1] = 1;
                this.brickGrid[2][1] = 1;
                this.brickGrid[0][0] = 1;
                this.brickGrid[0][1] = 1;
                this.rotationOrigin.set(1, 1);
                break;
            case 5:
                //Stair brick TODO: Limit rotation
                this.brickGrid[1][1] = 1;
                this.brickGrid[1][2] = 1;
                this.brickGrid[0][1] = 1;
                this.brickGrid[2][2] = 1;
                this.rotationOrigin.set(1,1);
                this.limitedRotation = true;
                break;
            case 6:
                //Other Stair brick TODO: Limit rotation
                this.brickGrid[1][1] = 1;
                this.brickGrid[1][2] = 1;
                this.brickGrid[0][2] = 1;
                this.brickGrid[2][1] = 1;
                this.rotationOrigin.set(1,1);
                this.limitedRotation = true;
                break;
            default:
                for(let i: number = 0; i < 4; i++) {
                    this.brickGrid[i] = [];
                    for(let j: number = 0; j< 4; j++) {
                        this.brickGrid[i][j] = 1;
                    }
                }
                break;

        }
    }

}