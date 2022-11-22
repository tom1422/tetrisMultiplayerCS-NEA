import TetrisGrid from "../../../TetrisGrid";
import MultiplayerGame from "../MultiplayerGame";
import SerialisedGrid from "./SerialisedGrid";

export default class SerialisedMultiplayerGame {

    grid: SerialisedGrid;

    constructor(multiplayerGame: MultiplayerGame, serialisedMultiplayerGame?: SerialisedMultiplayerGame) {
        //Constructing means sending to server - only send bare minimum
        if (serialisedMultiplayerGame != undefined) {
            this.grid = new SerialisedGrid(undefined, serialisedMultiplayerGame.grid);
        } else {
            this.grid = new SerialisedGrid(multiplayerGame.grid);
        }
    }

    public deserialise(): MultiplayerGame {
        let game = new MultiplayerGame();
        game.grid = this.grid.deserialise();
        return game;
    }

}