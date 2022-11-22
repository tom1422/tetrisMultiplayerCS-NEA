import MultiplayerCommunicator from "./communicators/MultiplayerCommunicator";
import Lobby from "./data/Lobby";
import NetworkedUser from "./data/NetworkedUser";
import MenuScreenCommunicator from "./communicators/MenuScreenCommunicator";
import MultiplayerGame from "./data/MultiplayerGame";
import TetrisGrid from "../TetrisGrid";
import SerialisedGrid from "./data/serialised/SerialisedGrid";
import SerialisedBrick from "./data/serialised/SerialisedBrick";
import MultiplayerVisual from "./MultiplayerVisual";
import GameSettings from "../GameSettings";

export default class Multiplayer {

    communicator: MultiplayerCommunicator;
    menuScreenTalker: MenuScreenCommunicator;
    lobby: Lobby;

    startMultiplayerGame: Function;
    endMultiplayerGame: Function;
    public multiplayerVisual: MultiplayerVisual;

    constructor(startMultiplayerGame: Function, endMultiplayerGame: Function) {
        //This class should be able to make and join lobbies and do other stuff when needed
        this.communicator = new MultiplayerCommunicator(this);
        this.startMultiplayerGame = startMultiplayerGame;
        this.endMultiplayerGame = endMultiplayerGame;
    }

    requestStartGame() {
        this.communicator.requestStartGame();
    }

    //They join or leave
    joinLobby(gameSettings: GameSettings, lobbyId?: string): void {
        if (lobbyId === undefined) {
            //They make new one
            lobbyId = (Math.random() * 1000).toString() + (Math.random() * 1000).toString() + (Math.random() * 1000).toString() + (Math.random() * 1000).toString();
        }
        if (gameSettings.username === undefined || gameSettings.username == "") {
            gameSettings.username = ("user" + (Math.random() * 1000).toString());
        }
        //Ask server to connect
        this.communicator.initiateConnection(gameSettings.username, lobbyId);
    }

    gameEnded(args): void {
        let winner: NetworkedUser = this.lobby.users.find(val => val.userID == args);
        let username = "";
        if (winner != undefined) {
            username = winner.username;
        } else {
            username = "nobody";
        }
        this.menuScreenTalker.updateEndScreenData(username);
        this.endMultiplayerGame(true);
    }

    tryLeaveLobby(): void {
        console.log("Attempting to leave lobby");
        this.communicator.socket.disconnect();
    }

    leaveLobby(): void {
        console.log("Left lobby!");
        //Check if they are in a game and end it
        if (this.lobby.currentGame != undefined) {
            //Cancel current game
            this.endMultiplayerGame(false);
        }
        this.lobby = undefined;
        this.menuScreenTalker.switchScreen(3);
    }

    returnToLobby(): void {
        this.menuScreenTalker.switchScreen(4);
        this.endMultiplayerGame(false);
    }

    //Other user joins and leaves
    youJoinedLobby(newUsers: NetworkedUser[], lobbyID: string) {
        this.lobby = new Lobby(lobbyID, newUsers);
        this.menuScreenTalker.updateMenuScreenData();
        this.menuScreenTalker.switchScreen(4);
    }

    //Other players join
    userJoins(username: string, userID: string) {
        this.lobby.addUser(new NetworkedUser(username, userID, false, false));
        this.menuScreenTalker.updateMenuScreenData();
    }

    userLeaves(userID: string) {
        this.lobby.removeUserByID(userID);
        this.menuScreenTalker.updateMenuScreenData();
    }

    //Multiplayer game started
    youGameStarted() {
        this.menuScreenTalker.switchScreen(0);
        this.lobby.currentGame = new MultiplayerGame();
        this.lobby.currentGame.grid = new TetrisGrid(10, 20);
        this.lobby.currentGame.grid.sendNetworkUpdateGameState = this.updateNetworkGameState.bind(this);
        this.startMultiplayerGame(this.lobby.currentGame.grid);
    }

    updateNetworkGameState() {
        this.communicator.updateGameState(this.lobby.currentGame);
    }

    gameStateUpdated(player: string, grid: SerialisedGrid) {
        if (player == this.lobby.users[0].userID) return;
        this.lobby.currentGame.grids.set(player, new SerialisedGrid(undefined, grid).deserialise());
        if (this.multiplayerVisual !== undefined) {
            this.multiplayerVisual.gridUpdated(player);
        }
    }
}