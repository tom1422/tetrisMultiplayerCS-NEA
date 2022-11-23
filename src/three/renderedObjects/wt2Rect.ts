import {Renderer} from "../Renderer";
import {Color, Group, Mesh, Object3D} from "three";
import MeshGenerator from "../MeshGenerator";
import wt2positionTranslator, {coordinate} from "./wt2positionTranslator";
import * as THREE from "three";
import Colour from "../../main/other/Colour";
import wt2Line from "./wt2Line";

export default class wt2Rect {

    renderer: Renderer;

    object: Group;
    background: Mesh;
    foreground: Mesh;

    debugLine: wt2Line;

    constructor(renderer: Renderer) {
        this.renderer = renderer;
    }

    make(x, y, radius, width, height, colour, borderWid, borderColour) {


        let obj1 = MeshGenerator.generateRoundedBoxBorder(radius, width, height, colour, borderWid, borderColour);
        this.background = obj1[0];
        this.foreground = obj1[1];
        this.object = new THREE.Group();
        this.object.add(this.background);
        this.object.add(this.foreground);

        //Debug
        this.debugLine = new wt2Line(this.renderer);
        this.debugLine.make(x, y);

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

    public setColour(button: Color, stroke: Color) {
        if (button != undefined) {
            this.background.material = new THREE.MeshBasicMaterial( { color: stroke } );
        }
        if (stroke != undefined) {
            this.foreground.material = new THREE.MeshBasicMaterial( { color: button } );
        }
    }

    public setPosition(x,y) {
        let newCoords: coordinate = wt2positionTranslator.translateCoordinates({x:x, y:y});
        if (x != undefined) {
            this.object.position.x = newCoords.x;
            this.debugLine.setPosition(x, undefined);
        }
        if (y != undefined) {
            this.object.position.y = newCoords.y;
            this.debugLine.setPosition(undefined, y);
        }
    }

}