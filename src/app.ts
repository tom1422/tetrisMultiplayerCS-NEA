import * as p5 from "p5";
import TetrisGame from "./main/TetrisGame";
import {Renderer} from "./three/Renderer";

const renderer = 'wt2'; //p5 or wt2

// @ts-ignore
if (renderer == 'p5') {
    function s(sketch:p5) {
        let gameObj:TetrisGame;
        sketch.setup = function() {
            gameObj = new TetrisGame(sketch);
        };
        sketch.draw = function() {
            gameObj.update();
        };
    }
    const myp5 = new p5(s);
} else if (renderer == 'wt2') {
    let test = new Renderer();
    let gameObj = new TetrisGame(undefined, test.wumThree2D);
    test.wumThree2D.animFunction = () => {gameObj.update();};
}



// const URL = "http://localhost:3000/";
// const socket = io(URL, { autoConnect: false });
//
// let network: Networking = new Networking(socket);
// (window as any).network = network;