import * as THREE from "three";
import {FontLoader} from "three/examples/jsm/loaders/FontLoader";
import {TextGeometry} from "three/examples/jsm/geometries/TextGeometry";
import {Renderer} from "./Renderer";

export default class wumThree2D {

    renderer: Renderer;

    animFunction: Function;

    constructor(renderer: Renderer) {
        this.renderer = renderer;
    }

    get windowWidth() {
        return window.innerWidth;
    }
    get windowHeight() {
        return window.innerHeight;
    }
}