import * as p5 from "p5";
import TetrisGame from "./main/TetrisGame";
import {Renderer} from "./3wum2D/Renderer";

function s(sketch:p5) {
    let gameObj:TetrisGame;

    sketch.setup = function() {
        gameObj = new TetrisGame(sketch);
    };

    sketch.draw = function() {
        gameObj.update();
    };

    sketch.windowResized = function(){
        sketch.resizeCanvas(sketch.windowWidth, sketch.windowHeight);
    };
}

//const myp5 = new p5(s);

const test = new Renderer();

// const URL = "http://localhost:3000/";
// const socket = io(URL, { autoConnect: false });
//
// let network: Networking = new Networking(socket);
// (window as any).network = network;