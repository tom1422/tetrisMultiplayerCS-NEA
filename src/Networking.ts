export default class Networking {

    usernameSelected: boolean = false;
    socket;
    users;

    constructor(socket) {
        this.socket = socket;
        socket.onAny(this.onAny.bind(this));

        socket.on("connect_error",this.connError.bind(this));
        socket.on("users", this.updateUsers.bind(this));
        socket.on("user connected", this.userJoined.bind(this));
    }

    usernameSelection(username: String, roomID: String) {
        this.usernameSelected = true;
        this.socket.auth = {username, roomID};
        this.socket.connect();
    }

    userJoined(user) {
        //Code to run specifically when user joins....
    }

    updateUsers(users) {
        console.log("Updating users");
        users.forEach((user) => {
            user.self = user.userID === this.socket.id;
            // initReactiveProperties(user);
        });
        // put the current user first, and then sort by username
        this.users = users.sort((a, b) => {
            if (a.self) return -1;
            if (b.self) return 1;
            if (a.username < b.username) return -1;
            return a.username > b.username ? 1 : 0;
        });
    }

    connError(err) {
        if (err.message === "invalid username") {
            this.usernameSelected = false;
            console.log("Invalid username!");
        }
    }

    onAny(event, ...args) {
        console.log(event, args);
    }
}