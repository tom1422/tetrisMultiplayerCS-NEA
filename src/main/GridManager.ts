import GridRenderer from "./renderer/SpecificRenderers/GridRenderer";
import Coordinate from "./other/Coordinate";
import Brick from "./brick/Brick";
import Colour from "./other/Colour";
import TetrisGrid from "./TetrisGrid";
import Observer from "./userinput/KeyUpdateObserverInterface";
import InputManagerSubjectInterface from "./userinput/InputManagerSubjectInterface";
import InputManagerSubject from "./userinput/InputManagerSubject";
import BrickLocation from "./brick/BrickLocation";
import KeyBurst from "./userinput/KeyBurst";
import GameSettings from "./GameSettings";

export default class GridManager implements Observer {

    grid: TetrisGrid;

    gameOverCallback: Function;

    lastDropTime: number;
    dropInterval: number = 1000;

    alreadySaved: boolean = false;

    gameStartTime: number = 0;
    speedIncreaseInterval: number = 30000;

    keyBurstProvider: KeyBurst;

    settings: GameSettings;

    constructor(grid: TetrisGrid, inputMan: InputManagerSubject, settings: GameSettings, gameOverCallback: Function) {
        inputMan.attach(this);
        this.grid = grid;
        this.gameOverCallback = gameOverCallback;
        this.keyBurstProvider = new KeyBurst(this.keyBurst.bind(this));
        this.settings = settings;
        this.gameStartTime = Date.now();
    }

    update(): void {
        this.keyBurstProvider.update();
        this.autoBrickDropping();
    }

    autoBrickDropping(): void {
        if (Date.now() > this.lastDropTime + this.dropInterval) {
            //Calculate time
            let periodsOf30s = (Date.now() - this.gameStartTime) / this.speedIncreaseInterval;
            let dropInterv = 1000;
            for (let i: number = 0; i < Math.floor(periodsOf30s); i++) {
                dropInterv = dropInterv - (dropInterv * (1/20));
            }
            if (dropInterv < 300) dropInterv = 300;
            this.dropInterval= dropInterv;
            //Move it down
            this.moveBy(0, 1, 0);
        }
    }

    keyPress(subject: InputManagerSubjectInterface): void {
        this.keyBurstProvider.keyDown(subject.keyPressed);
        let key = subject.keyPressed.toLowerCase();
        this.keyEvent(key);
    }

    keyRelease(subject: InputManagerSubjectInterface): void {
        this.keyBurstProvider.keyUp(subject.keyReleased);
    }

    keyBurst(): void {
        let key = this.keyBurstProvider.keyPressed.toLowerCase();
        //Filter keys
        if ("asd".includes(key) || key == "arrowleft" || key == "arrowright" || key == "arrowdown") {
            this.keyEvent(key);
        }
    }

    keyEvent(key: string) {
        if (key == "w" || key == "arrowup" || key == "r" || key == this.settings.rotatebind) {
            this.moveBy(0, 0, 90);
        }
        if (key == "s" || key == "arrowdown" || key == this.settings.downbind) {
            this.moveBy(0, 1, 0);
        }
        if (key == "a" || key == "arrowleft" || key == this.settings.leftbind) {
            this.moveBy(-1, 0, 0);
        }
        if (key == "d" || key == "arrowright" || key == this.settings.rightbind) {
            this.moveBy(1, 0, 0);
        }
        if (key == "v" || key == this.settings.savebind) {
            this.saveBrick();
        }
        if (key == " " || key == "enter" || key == this.settings.placebind) {
            this.forcePlacement();
        }
    }

    saveBrick(): void {
        if (this.alreadySaved) return;
        this.alreadySaved = true;
        if (this.grid.savedBrick == undefined) {
            this.grid.savedBrick = this.grid.nextBrick;
            this.grid.nextBrick = new Brick();
        } else {
            let tmp = undefined;
            this.grid.nextBrick = this.grid.savedBrick;
            this.grid.savedBrick = tmp;
        }
    }

    dispenseNewBrick(): void {
        if (this.grid.nextBrick == undefined) {
            this.grid.currentBrick = new Brick();
        } else {
            this.grid.currentBrick = this.grid.nextBrick;
        }
        this.grid.nextBrick = new Brick();
        this.alreadySaved = false;
        this.grid.updateGameState();
    }

    forcePlacement() {
        //Move X down until it stops
        while (this.moveBy(0, 1, 0)) {}
    }

    //Returns true if moved successfully
    moveBy(x: number, y: number, rotation: number): boolean {
        if (this.grid.currentBrick === undefined)
            return;

        //Save old attributes
        let oldLocation: BrickLocation = this.grid.currentBrick.location.copy();

        //Update current brick's attributes
        this.grid.currentBrick.location.x += x;
        this.grid.currentBrick.location.y += y;
        this.grid.currentBrick.rotate(rotation);

        if (this.checkCollision(this.grid.currentBrick, this.grid)) {
            //Revert Changes
            this.grid.currentBrick.location = oldLocation;
            if (y > 0) {
                //Places brick if it is in the right position
                this.placeBrick();
            }
            return false;
        }

        //Set back automatic dropping
        if (y > 0 || rotation != 0) {
            this.lastDropTime = Date.now();
        }

        //Increment score
        if (y > 0) {
            this.grid.score += 1;
        }

        //Send network update if possible
        this.grid.updateGameState();
        return true;
    }

    placeBrick() {
        this.lockBrickInGrid(this.grid.currentBrick);
        this.grid.currentBrick = undefined;

        //Now check for the end of the game
        if (this.checkForEndCondition()) {
            this.grid.eliminated = true;
            this.gameOverCallback();
            //Send network update if possible
            this.grid.updateGameState();
            return;
        }
        //Check for completed rows
        this.completedRows();

        //Make new brick
        this.dispenseNewBrick();


        this.keyBurstProvider.keyPressed = undefined;
    }

    checkForEndCondition(): boolean {
        let brickGrid:number[][] = this.grid.gridArray;
        for (let i: number = 0; i < brickGrid.length; i++) {
            if (brickGrid[i][0] != 0) {
                return true;
            }
        }
        return false;
    }

    completedRows(): void {
        let rowsComplete: number = 0;
        let brickGrid: number[][] = this.grid.gridArray;
        for (let j: number = 0; j < brickGrid[0].length; j++) {
            let rowComplete: boolean = true;
            for (let i: number = 0; i < brickGrid.length; i++) {
                if (brickGrid[i][j] == 0) {
                    rowComplete = false;
                }
            }
            //Remove row and shift others down if it is complete
            if (rowComplete) {
                for (let y:number = j; y > 0; y--) {
                    for (let x: number = 0; x < brickGrid.length; x++) {
                        brickGrid[x][y] = brickGrid[x][y-1];
                    }
                }
                rowsComplete += 1;
            }
        }
        this.grid.score += (rowsComplete * 10) * rowsComplete;
    }

    lockBrickInGrid(brick: Brick) {
        let brickGrid:number[][] = brick.getRotatedBrick();
        for (let i: number = 0; i < brickGrid.length; i++) {
            for (let j:number = 0; j < brickGrid[0].length; j++) {
                let x: number = i + brick.location.x;
                let y: number = j + brick.location.y;
                if (brickGrid[i][j] != 0) {
                    this.grid.gridArray[x][y] = brick.renderedBrick.colour;
                }
            }
        }
    }



    checkCollision(brick: Brick, grid: TetrisGrid): boolean {
        let brickGrid:number[][] = brick.getRotatedBrick();
        for (let i: number = 0; i < brickGrid.length; i++) {
            for (let j:number = 0; j < brickGrid[0].length; j++) {
                if (brickGrid[i][j] != 0) {
                    let x: number = i + brick.location.x;
                    let y: number = j + brick.location.y;
                    if (x >= grid.gridArray.length)
                        return true;
                    if (x < 0)
                        return true;
                    if (y >= grid.gridArray[0].length)
                        return true;
                    if (y < 0)
                        return true;
                    if (grid.gridArray[x][y] != 0)
                        return true;
                }
            }
        }
        return false;
    }
}