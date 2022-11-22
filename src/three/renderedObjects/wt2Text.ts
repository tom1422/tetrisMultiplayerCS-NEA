import {Renderer} from "../Renderer";
import MeshGenerator from "../MeshGenerator";
import {Font} from "three/examples/jsm/loaders/FontLoader";
import {Color, Mesh, Object3D} from "three";
import wt2Font from "./wt2Font";
import wt2positionTranslator, {coordinate} from "./wt2positionTranslator";
import * as THREE from "three";

export default class wt2Text {

    renderer: Renderer;

    object: Mesh;

    runAfterLoad: Function[] = [];
    loaded: boolean = true;

    constructor(renderer: Renderer) {
        this.renderer = renderer;
    }

    make(x, y, height, text, font: wt2Font, align: number) {
        if (font.font == undefined) {
            //Wait for font
            this.loaded = false;
            font.loadCallback.push(() => {
                this.loaded = true;
                this.runAfterLoad.forEach((value) => {value();});
            })
        }
        this.makeAndAdd(x, y, height, text, font, align);
    }

    private makeAndAdd(x, y, height, text, font: wt2Font, align: number) {
        if (!this.loaded) { this.runAfterLoad.push(() => { this.makeAndAdd(x, y, height, text, font, align); }); return; }

        let newCoords: coordinate = wt2positionTranslator.translateCoordinates({x:x, y:y});
        this.object = MeshGenerator.drawText(newCoords.x, newCoords.y, height, text, font.font, align);
        this.renderer.mainScene.add(this.object);
    }

    public hide() {
        if (!this.loaded) { this.runAfterLoad.push(() => { this.hide(); }); return; }

        this.renderer.mainScene.remove(this.object);
    }

    public show() {
        if (!this.loaded) { this.runAfterLoad.push(() => { this.show(); }); return; }

        this.renderer.mainScene.add(this.object);
    }

    public setColour(threeColor: Color) {
        if (!this.loaded) { this.runAfterLoad.push(() => { this.setColour(threeColor); }); return; }

        this.object.material = new THREE.MeshBasicMaterial( { color: threeColor} );
    }


    public setPosition(x,y) {
        if (!this.loaded) { this.runAfterLoad.push(() => { this.setPosition(x,y); }); return; }
        if (x != undefined) {
            this.object.position.x = x;
        }
        if (y != undefined) {
            this.object.position.y = y;
        }
    }

}