import TetrisGrid from "../../TetrisGrid";
import SerialisedGrid from "./serialised/SerialisedGrid";

export default class MultiplayerGame {
    grid: TetrisGrid;
    grids: Map<string, TetrisGrid> = new Map();
}