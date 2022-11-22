import {Renderer} from "../Renderer";
import {Object3D} from "three";
import MeshGenerator from "../MeshGenerator";
import wt2positionTranslator, {coordinate} from "./wt2positionTranslator";

export default class wt2Rect {

    renderer: Renderer;

    object: Object3D;

    constructor(renderer: Renderer) {
        this.renderer = renderer;
    }

    make(x, y, radius, width, height, colour, borderWid, borderColour) {
        let newCoords: coordinate = wt2positionTranslator.translateCoordinates({x:x, y:y});
        this.object = MeshGenerator.generateRoundedBoxBorder(newCoords.x, newCoords.y, radius, width, height, colour, borderWid, borderColour);
        this.renderer.mainScene.add(this.object);
    }

}