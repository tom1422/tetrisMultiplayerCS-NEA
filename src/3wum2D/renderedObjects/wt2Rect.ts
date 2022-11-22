import {Renderer} from "../Renderer";
import {Object3D} from "three";
import MeshGenerator from "../MeshGenerator";

export default class wt2Rect {

    renderer: Renderer;

    object: Object3D;

    constructor(renderer: Renderer) {
        this.renderer = renderer;
    }

    make(x, y, radius, width, height, colour, borderWid, borderColour) {
        this.object = MeshGenerator.generateRoundedBoxBorder(x, y, radius, width, height, colour, borderWid, borderColour);
        this.renderer.mainScene.add(this.object);
    }

}