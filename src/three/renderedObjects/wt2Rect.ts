import {Renderer} from "../Renderer";
import {Color, Group, Mesh, Object3D} from "three";
import MeshGenerator from "../MeshGenerator";
import wt2positionTranslator, {coordinate} from "./wt2positionTranslator";
import * as THREE from "three";
import Colour from "../../main/other/Colour";

export default class wt2Rect {

    renderer: Renderer;

    object: Group;
    background: Mesh;
    foreground: Mesh;

    constructor(renderer: Renderer) {
        this.renderer = renderer;
    }

    make(x, y, radius, width, height, colour, borderWid, borderColour) {
        let newCoords: coordinate = wt2positionTranslator.translateCoordinates({x:x, y:y});
        let obj1 = MeshGenerator.generateRoundedBoxBorder(newCoords.x, newCoords.y, radius, width, height, colour, borderWid, borderColour);
        this.background = obj1[0];
        this.foreground = obj1[1];
        this.object = new THREE.Group();
        this.object.add(this.background);
        this.object.add(this.foreground);
        this.show();
    }

    public hide() {
        this.renderer.mainScene.remove(this.object);
    }

    public show() {
        this.renderer.mainScene.add(this.object);
    }

    public setColour(button: Color, stroke: Color) {
        if (button != undefined) {
            this.background.material = new THREE.MeshBasicMaterial( { color: stroke } );
        }
        if (stroke != undefined) {
            this.foreground.material = new THREE.MeshBasicMaterial( { color: button } );
        }
    }

    public setPosition(x,y) {
        if (x != undefined) {
            this.object.position.x = x;
        }
        if (y != undefined) {
            this.object.position.y = y;
        }
    }

}