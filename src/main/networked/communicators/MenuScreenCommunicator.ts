import Text from "../../menu/Text";
import Multiplayer from "../Multiplayer";
import Table from "../../menu/Table";
import Colour from "../../other/Colour";
import MenuScreen from "../../MenuScreen";
import Button from "../../menu/Button";

export default class MenuScreenCommunicator {

    multiplayerManager: Multiplayer;
    menuScreen: MenuScreen;

    //Ref to lobby screen objects
    menuTitle: Text;
    menuUsers: Table;

    constructor(multiplayerManager: Multiplayer, menuScreen: MenuScreen) {
        this.multiplayerManager = multiplayerManager;
        this.menuScreen = menuScreen;
        this.buildMenuScreen();
        this.buildEndGameScreen();
    }

    buildMenuScreen() {
        this.menuTitle = new Text(this.menuScreen.renderer.menuItemRenderer, "Lobby: ", 30, new Colour(0, 0, 0), 2, 1, this.menuScreen.renderer.font[0]);
        this.menuScreen.registerItem(4, this.menuTitle);
        this.menuScreen.registerItem(4, new Button(this.menuScreen.renderer.menuItemRenderer, "<- Exit Lobby", 220, 50, 2, () => {this.multiplayerManager.tryLeaveLobby();}));

        this.menuUsers = new Table(this.menuScreen.renderer.menuItemRenderer, 1, 4, 220, 30);
        this.menuUsers.addMenuItem(0, 0, new Text(this.menuScreen.renderer.menuItemRenderer, "Connected Users: ", 23, new Colour(0, 0, 0), 2, 1, this.menuScreen.renderer.font[1]));
        this.menuScreen.registerItem(4, this.menuUsers);
        this.menuScreen.registerItem(4, new Button(this.menuScreen.renderer.menuItemRenderer, "Start Game", 220, 50, 2, () => {this.multiplayerManager.requestStartGame();}));
    }

    buildEndGameScreen() {
        this.menuScreen.registerItem(6, new Text(this.menuScreen.renderer.menuItemRenderer, "Game Over", 30, new Colour(0, 0, 0), 2, 1, this.menuScreen.renderer.font[0]));
        this.menuScreen.registerItem(6, new Button(this.menuScreen.renderer.menuItemRenderer, "Return to lobby", 220, 50, 2, () => {this.multiplayerManager.returnToLobby();}));
        this.menuScreen.registerItem(6, new Button(this.menuScreen.renderer.menuItemRenderer, "<- Back to main menu", 220, 50, 2, () => {this.multiplayerManager.tryLeaveLobby();}));
    }

    updateMenuScreenData() {
        this.menuTitle.setText("Lobby: " + this.multiplayerManager.lobby.lobbyID + " - " + (this.multiplayerManager.lobby.users[0].host ? "Host" : "Client") + "");
        let users = this.multiplayerManager.lobby.users;
        this.menuUsers.resize(users.length + 1);
        for (let i = 0; i < users.length; i++) {
            this.menuUsers.addMenuItem(1 + i, 0, new Text(this.menuScreen.renderer.menuItemRenderer, users[i].username, 23, new Colour(2,2, 2), 23, 0, this.menuScreen.renderer.font[2]));
        }
    }

    updateEndScreenData(username: string) {
        let text: Text = this.menuScreen.getMenuItems(6)[0];
        text.setText("Game Over. Winner: " + username);
    }

    switchScreen(screen: number) {
        this.menuScreen.screenType = screen;
    }
}