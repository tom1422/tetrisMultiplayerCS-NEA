import * as THREE from "three";
import {FontLoader} from "three/examples/jsm/loaders/FontLoader";
import {TextGeometry} from "three/examples/jsm/geometries/TextGeometry";
import {Renderer} from "./Renderer";

export default class wumThree2D {

    renderer: Renderer;

    animFunction: Function;

    mousePressed: boolean = false;
    mouseX: number = 0;
    mouseY: number = 0;

    constructor(renderer: Renderer) {
        this.renderer = renderer;

        document.addEventListener( 'mousemove', (event) => {
            this.mouseX = event.clientX;
            this.mouseY = event.clientY;
        }, false );
        document.addEventListener( 'mousedown', () => {this.mousePressed = true}, false );
        document.addEventListener( 'mouseup', () => {this.mousePressed = false}, false );
    }

    get windowWidth() {
        return window.innerWidth;
    }
    get windowHeight() {
        return window.innerHeight;
    }
}