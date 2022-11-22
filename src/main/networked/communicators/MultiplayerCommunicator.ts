
import NetworkedUser from "../data/NetworkedUser";
import Multiplayer from "../Multiplayer";
import MultiplayerGame from "../data/MultiplayerGame";
import SerialisedMultiplayerGame from "../data/serialised/SerialisedMultiplayerGame";
import SerialisedGrid from "../data/serialised/SerialisedGrid";
import {io, Socket} from "socket.io-client";

export default class MultiplayerCommunicator {

    socket: Socket;
    multiplayerManager: Multiplayer;

    constructor(multiplayerManager: Multiplayer) {
        this.multiplayerManager = multiplayerManager;
        const URL = "http://localhost:3000/";
        const socket = io(URL, {autoConnect: false});
        this.socket = socket;
        socket.onAny(this.onAny.bind(this));
        socket.on("user_join", this.userJoin.bind(this));
        socket.on("user_left", this.userLeft.bind(this));
        socket.on("connect_error",this.connError.bind(this));
        socket.on("users", this.joinedLobby.bind(this));
        socket.on("disconnect", this.lobbyClosed.bind(this));

        socket.on("game_start", this.gameStarted.bind(this));
        socket.on("game_state_update", this.gameStateUpdated.bind(this));

        socket.on("game_finished", this.gameEnded.bind(this));
    }

    updateGameState(multiplayerGame: MultiplayerGame) {
        this.socket.emit("game_state_update", new SerialisedMultiplayerGame(multiplayerGame))
    }

    gameStateUpdated(newState: any) {
        // console.log((<SerialisedGrid>newState.grid));
        // console.log(newState.player);
        this.multiplayerManager.gameStateUpdated(<string>newState.player, <SerialisedGrid>newState.grid)
    }

    requestStartGame() {
        this.socket.emit("game_start", true);
    }

    initiateConnection(username: String, roomID: String) {
        this.socket.auth = {username, roomID};
        this.socket.connect();
    }

    joinedLobby(users) {
        console.log("You joined, got new user list!");
        let newUsers: NetworkedUser[] = [];
        users.forEach((user) => {
            newUsers.push(new NetworkedUser(user.username, user.userID, user.userID === this.socket.id, user.host));
        });
        this.multiplayerManager.youJoinedLobby(newUsers, users[0].lobbyID);
    }

    lobbyClosed() {
        this.multiplayerManager.leaveLobby();
    }

    userJoin(user) {
        this.multiplayerManager.userJoins(user.username, user.userID);
    }

    userLeft(user) {
        this.multiplayerManager.userLeaves(user.userID);
    }

    gameStarted() {
        this.multiplayerManager.youGameStarted();
    }

    gameEnded(args) {
        this.multiplayerManager.gameEnded(args);
    }

    connError(err) {
        console.log("Unknown error! (" + err + ")");
    }

    onAny(event, ...args) {
        //console.log(event, args);
    }
}