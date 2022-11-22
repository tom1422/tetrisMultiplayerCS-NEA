import * as THREE from "three";
import {FontLoader} from "three/examples/jsm/loaders/FontLoader";
import {TextGeometry} from "three/examples/jsm/geometries/TextGeometry";
import {Renderer} from "./Renderer";

export default class wumThree2D {

    renderer: Renderer;

    constructor(renderer: Renderer) {
        this.renderer = renderer;
    }
}