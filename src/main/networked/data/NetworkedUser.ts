export default class NetworkedUser {
    self: boolean = false;
    username: string;
    userID: string;
    host: boolean;

    constructor(username: string, userID: string, self: boolean, host: boolean) {
        this.username = username;
        this.userID = userID;
        this.self = self;
        this.host = host;
    }
}