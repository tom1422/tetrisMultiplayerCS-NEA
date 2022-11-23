import {Renderer} from "../Renderer";
import {Color, Group, Line, Mesh, Object3D} from "three";
import MeshGenerator from "../MeshGenerator";
import wt2positionTranslator, {coordinate} from "./wt2positionTranslator";
import * as THREE from "three";
import Colour from "../../main/other/Colour";

export default class wt2Line {

    renderer: Renderer;

    object: Line;

    constructor(renderer: Renderer) {
        this.renderer = renderer;
    }

    make(x, y) {
        //create a blue LineBasicMaterial
        const material = new THREE.LineBasicMaterial( { color: 0x000000 } );

        const points = [];
        points.push( new THREE.Vector3( 0, 0, 0 ) );
        points.push( new THREE.Vector3( 0, 0, 5 ) );

        const geometry = new THREE.BufferGeometry().setFromPoints( points );

        this.object = new THREE.Line( geometry, material );

        this.setPosition(x, y);

        this.show();
    }

    public hide() {
        this.renderer.mainScene.remove(this.object);
    }

    public show() {
        this.renderer.mainScene.add(this.object);
    }

    public setColour(button: Color, stroke: Color) {
    }

    public setPosition(x,y) {
        let newCoords: coordinate = wt2positionTranslator.translateCoordinates({x:x, y:y});
        if (x != undefined) {
            this.object.position.x = newCoords.x;
        }
        if (y != undefined) {
            this.object.position.y = newCoords.y;
        }
    }

}