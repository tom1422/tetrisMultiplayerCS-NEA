import {Renderer} from "../Renderer";
import {Color, Group, Mesh, Object3D} from "three";
import MeshGenerator from "../MeshGenerator";
import wt2positionTranslator, {coordinate} from "./wt2positionTranslator";
import * as THREE from "three";
import Colour from "../../main/other/Colour";
import wt2Line from "./wt2Line";
import Coordinate from "../../main/other/Coordinate";

export default class wt2Rect {

    renderer: Renderer;

    object: Group;
    background: Mesh;
    foreground: Mesh;

    debugLine: wt2Line;

    constructor(renderer: Renderer) {
        this.renderer = renderer;
    }

    make(posInfo: rectPosInfo) {
        let obj1 = MeshGenerator.generateRoundedBoxBorder(posInfo.radius, posInfo.width, posInfo.height, posInfo.borWid);
        this.background = obj1[0];
        this.foreground = obj1[1];
        this.foreground.position.z += 0.5;
        this.object = new THREE.Group();
        this.object.add(this.background);
        this.object.add(this.foreground);


        //Debug
        this.debugLine = new wt2Line(this.renderer);
        this.debugLine.make(posInfo.pos);

        this.setPosition(posInfo.pos);

        this.show();
    }

    public hide() {
        this.renderer.mainScene.remove(this.object);
        this.debugLine.hide();
    }

    public show() {
        this.renderer.mainScene.add(this.object);
        this.debugLine.show();
    }

    public setColour(button: Color) {
        if (button != undefined) {
            this.foreground.material = new THREE.MeshBasicMaterial( { color: button } );
        }
    }

    public setStrokeColour(stroke: Color) {
        if (stroke != undefined) {
            this.background.material = new THREE.MeshBasicMaterial( { color: stroke } );
        }
    }

    public setPosition(pos: Coordinate) {
        this.object.position.x = pos.x;
        this.object.position.y = pos.y;
        this.debugLine.setPosition(pos);
    }

    public setWeight(weight: number) {
        this.object.position.z = weight;
    }

}

export type rectPosInfo = {
    pos: Coordinate;
    width: number;
    height: number;
    radius: number;
    borWid: number;
}