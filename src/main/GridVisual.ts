import GridRenderer from "./renderer/SpecificRenderers/GridRenderer";
import TetrisGrid from "./TetrisGrid";
import Colour from "./other/Colour";
import Coordinate from "./other/Coordinate";
import UsefulUtils from "./other/UsefulUtils";
import Renderer from "./renderer/Renderer";

export default class GridVisual {

    gridRenderer: GridRenderer;

    resized: boolean = false;
    xOffset: number = 0;
    yOffset: number = 40;

    grid: TetrisGrid;

    squareSize: number;
    squareBorderSize: number = 1;

    graphicRect_Game: string;
    graphicGrid_Game: string;
    graphicGrid_Next: string;
    graphicGrid_Saved: string;
    graphicGrid_CurrentBrick: string;

    graphicText_Name: string;
    graphicText_Score: string;
    graphicText_Next: string;
    graphicText_Saved: string;

    graphicText_Eliminated: string;
    graphicRect_Eliminated: string;

    constructor(grid: TetrisGrid, gridRenderer: GridRenderer, renderer: Renderer) {
        renderer.onWindowResize.push(this.windowResize.bind(this));
        this.grid = grid;
        this.gridRenderer = gridRenderer;
        this.squareSize = 20;

        this.createGrid();
        this.createText();

        //On game state update...
        this.grid.sendVisualUpdate = this.updateGameInformation.bind(this);

        this.windowResize();
    }

    windowResize() {
        this.resized = true;
    }

    recenter(): void {
        this.xOffset = (this.gridRenderer.canvasWidth / 2) - ((this.grid.gridArray.length * this.squareSize) / 2);
    }

    //Draw each frame
    update(xPos?: number, yPos?: number): void {
        if (xPos != undefined) {
            this.xOffset = xPos;
            this.yOffset = yPos;
        } else {
            this.recenter();
        }
        if (this.resized) {
            this.resized = false;
            this.updateAllPositions();
        }

        //Draw front gray if eliminated
        if (this.grid.eliminated && this.graphicRect_Eliminated == undefined) {
            this.createEliminatedScreen();
        }

        //Draw everything!
        this.gridRenderer.drawThisFrame();
    }

    updateGameInformation() {
        this.gridRenderer.updateGrid(this.graphicGrid_Game, {
            gridArray: this.grid.gridArray,
        });
        this.gridRenderer.updateGrid(this.graphicGrid_Next, {
            gridArray: (this.grid.nextBrick == undefined ? [] : this.grid.nextBrick.getRotatedBrick(true)),
        });
        this.gridRenderer.updateGrid(this.graphicGrid_Saved, {
            gridArray: (this.grid.savedBrick == undefined ? [] : this.grid.savedBrick.getRotatedBrick(true)),
        });
        this.gridRenderer.updateGrid(this.graphicGrid_CurrentBrick, {
            gridArray: (this.grid.currentBrick == undefined ? [] : this.grid.currentBrick.getRotatedBrick(true)),
            zeroIsTransparent: true,
            pos: new Coordinate(
                (this.squareSize + this.squareBorderSize )*(this.grid.currentBrick == undefined ? 0 : this.grid.currentBrick.location.x) + this.xOffset,
                (this.squareSize + this.squareBorderSize )*(this.grid.currentBrick == undefined ? 0 : this.grid.currentBrick.location.y) + this.yOffset),
        });
        this.gridRenderer.updateText(this.graphicText_Score, {
            text: "Score: " + this.grid.score,
        });
        this.gridRenderer.updateText(this.graphicText_Name, {
            text: this.grid.username,
        });
    }

    updateAllPositions() {
        this.gridRenderer.updateRectangle(this.graphicRect_Game, {
            pos: new Coordinate(
                this.xOffset-1,
                this.yOffset-1),
        });
        this.gridRenderer.updateGrid(this.graphicGrid_Game, {
            pos: new Coordinate(
                this.xOffset,
                this.yOffset),
        });
        this.gridRenderer.updateGrid(this.graphicGrid_Next, {
            pos: new Coordinate(
                (this.xOffset + 35 + (this.squareSize*this.grid.gridArray.length)),
                this.yOffset + 22),
        });
        this.gridRenderer.updateGrid(this.graphicGrid_Saved, {
            pos: new Coordinate(
                (this.xOffset + 35 + (this.squareSize*this.grid.gridArray.length)),
                this.yOffset + 152),
        });
        this.gridRenderer.updateGrid(this.graphicGrid_CurrentBrick, {
            pos: new Coordinate(
                (this.squareSize + this.squareBorderSize )*(this.grid.currentBrick == undefined ? 0 : this.grid.currentBrick.location.x) + this.xOffset,
                (this.squareSize + this.squareBorderSize )*(this.grid.currentBrick == undefined ? 0 : this.grid.currentBrick.location.y) + this.yOffset),
        });
        this.gridRenderer.updateText(this.graphicText_Name, {
            pos: new Coordinate(
                (this.xOffset + (this.squareSize*this.grid.gridArray.length)/2),
                this.yOffset - 27),
        });
        this.gridRenderer.updateText(this.graphicText_Score, {
            pos: new Coordinate(
                (this.xOffset + (this.squareSize*this.grid.gridArray.length)/2),
                this.yOffset - 10),
        });
        this.gridRenderer.updateText(this.graphicText_Next, {
            pos: new Coordinate(
                (this.xOffset + 35 + (this.squareSize*this.grid.gridArray.length)),
                this.yOffset + 12),
        });
        this.gridRenderer.updateText(this.graphicText_Saved, {
            pos: new Coordinate(
                (this.xOffset + 35 + (this.squareSize*this.grid.gridArray.length)),
                this.yOffset + 142),
        });
    }

    createGrid() {
        this.graphicRect_Game = this.gridRenderer.createRectangle({
            pos: new Coordinate(
                this.xOffset-1,
                this.yOffset-1),
            width: ((this.squareSize + this.squareBorderSize) * this.grid.gridArray.length - this.squareBorderSize) + 6,
            height: ((this.squareSize + this.squareBorderSize) * this.grid.gridArray[0].length - this.squareBorderSize) + 6,
            radius: 4,
            colour: new Colour(121, 121, 121),
            strokeColour: new Colour(1, 1, 1),
        });
        this.graphicGrid_Game = this.gridRenderer.createGrid({
            gridArray: this.grid.gridArray,
            pos: new Coordinate(
                this.xOffset,
                this.yOffset),
            boxWidth: this.squareSize,
            boxHeight: this.squareSize,
            boxRadius: 1,
        });
        this.graphicGrid_Next = this.gridRenderer.createGrid({
            gridArray: (this.grid.nextBrick == undefined ? UsefulUtils.generate2DNumberArray(4, 4, true) : this.grid.nextBrick.getRotatedBrick(true)),
            pos: new Coordinate(
                (this.xOffset + 35 + (this.squareSize*this.grid.gridArray.length)),
                this.yOffset + 22),
            boxWidth: this.squareSize,
            boxHeight: this.squareSize,
            boxRadius: 1,
        });
        this.graphicGrid_Saved = this.gridRenderer.createGrid({
            gridArray: (this.grid.savedBrick == undefined ? UsefulUtils.generate2DNumberArray(4, 4, true) : this.grid.savedBrick.getRotatedBrick(true)),
            pos: new Coordinate(
                (this.xOffset + 35 + (this.squareSize*this.grid.gridArray.length)),
                this.yOffset + 152),
            boxWidth: this.squareSize,
            boxHeight: this.squareSize,
            boxRadius: 1,
        });
        this.graphicGrid_CurrentBrick = this.gridRenderer.createGrid({
            gridArray: (this.grid.currentBrick == undefined ? UsefulUtils.generate2DNumberArray(4, 4, true) : this.grid.currentBrick.getRotatedBrick(true)),
            pos: new Coordinate(
                (this.squareSize + this.squareBorderSize )*(this.grid.currentBrick == undefined ? 0 : this.grid.currentBrick.location.x) + this.xOffset,
                (this.squareSize + this.squareBorderSize )*(this.grid.currentBrick == undefined ? 0 : this.grid.currentBrick.location.y) + this.yOffset),
            boxWidth: this.squareSize,
            boxHeight: this.squareSize,
            boxRadius: 1,
            zeroIsTransparent: true,
        });
    }

    createText() {
        this.graphicText_Name = this.gridRenderer.createText({
            text: this.grid.username,
            pos: new Coordinate(
                (this.xOffset + (this.squareSize*this.grid.gridArray.length)/2),
                this.yOffset - 27),
            fontSize: 20,
            textAlign: 1,
            fontName: "Trebuchet MS",
            colour: new Colour(2, 2, 2),
            strokeColour: undefined,
        });
        this.graphicText_Score = this.gridRenderer.createText({
            text: "Score: " + this.grid.score,
            pos: new Coordinate(
                (this.xOffset + (this.squareSize*this.grid.gridArray.length)/2),
                this.yOffset - 10),
            fontSize: 20,
            textAlign: 1,
            fontName: "Trebuchet MS",
            colour: new Colour(2, 2, 2),
            strokeColour: undefined,
        });
        this.graphicText_Next = this.gridRenderer.createText({
            text: "Next Brick",
            pos: new Coordinate(
                (this.xOffset + 35 + (this.squareSize*this.grid.gridArray.length)),
                this.yOffset + 12),
            fontSize: 15,
            textAlign: 0,
            fontName: "Trebuchet MS",
            colour: new Colour(2, 2, 2),
            strokeColour: undefined,
        });
        this.graphicText_Saved = this.gridRenderer.createText({
            text: "Saved Brick",
            pos: new Coordinate(
                (this.xOffset + 35 + (this.squareSize*this.grid.gridArray.length)),
                this.yOffset + 142),
            fontSize: 15,
            textAlign: 0,
            fontName: "Trebuchet MS",
            colour: new Colour(2, 2, 2),
            strokeColour: undefined,
        });
    }

    createEliminatedScreen() {
        this.graphicRect_Eliminated = this.gridRenderer.createRectangle({
            pos: new Coordinate(
                this.xOffset,
                this.yOffset),
            width: ((this.squareSize + this.squareBorderSize) * this.grid.gridArray.length - this.squareBorderSize) + 6,
            height: ((this.squareSize + this.squareBorderSize) * this.grid.gridArray[0].length - this.squareBorderSize) + 6,
            radius: 5,
            colour: new Colour(50, 50, 50, 200),
            strokeColour: new Colour(1, 1, 1),
        });

        this.graphicText_Eliminated = this.gridRenderer.createText({
            text: "Eliminated",
            pos: new Coordinate(
                (this.xOffset + (this.squareSize*this.grid.gridArray.length)/2),
                this.yOffset + 35),
            fontSize: 27,
            textAlign: 1,
            fontName: "Trebuchet MS",
            colour: new Colour(255, 255, 255),
            strokeColour: undefined,
        });
    }
}