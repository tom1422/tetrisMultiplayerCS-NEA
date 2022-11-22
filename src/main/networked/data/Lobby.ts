import NetworkedUser from "./NetworkedUser";
import Text from "../../menu/Text";
import MultiplayerGame from "./MultiplayerGame";

export default class Lobby {
    lobbyID: string;
    hostID: string;
    users: NetworkedUser[] = [];

    currentGame: MultiplayerGame;

    constructor(lobbyID: string, newUsers: NetworkedUser[]) {
        this.lobbyID = lobbyID;
        this.users = newUsers;
        this.sortUsers();
    }

    addUser(user: NetworkedUser) {
        this.users.push(user);
        this.sortUsers();
    }

    removeUserByID(id: string): boolean {
        let found: boolean = false;
        this.users = this.users.filter(function(user) {
            console.log(id, user.userID)
            if (user.userID === id) {
                found = true;
                return false;
            }
            return true;
        });
        return found;
    }

    sortUsers() {
        this.users = this.users.sort((a, b) => {
            if (a.self) return -1;
            if (b.self) return 1;
            if (a.userID < b.userID) return -1;
            return a.userID > b.userID ? 1 : 0;
        });
    }
}
