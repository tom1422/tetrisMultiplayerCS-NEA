import {Renderer} from "../Renderer";
import MeshGenerator from "../MeshGenerator";
import {Font} from "three/examples/jsm/loaders/FontLoader";
import {Color, Mesh, Object3D} from "three";
import wt2Font from "./wt2Font";
import wt2positionTranslator, {coordinate} from "./wt2positionTranslator";
import * as THREE from "three";
import wt2Line from "./wt2Line";

export default class wt2Text {

    renderer: Renderer;

    object: Mesh;

    runAfterLoad: Function[] = [];
    loaded: boolean = true;

    debugLine: wt2Line;

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
        } else {
            return;
        }
        this.makeAndAdd(x, y, height, text, font, align);
    }

    private makeAndAdd(x, y, height, text, font: wt2Font, align: number) {
        if (!this.loaded) { this.runAfterLoad.push(() => { this.makeAndAdd(x, y, height, text, font, align); }); return; }

        this.object = MeshGenerator.drawText(height, text, font.font, 0);

        //Debug
        this.debugLine = new wt2Line(this.renderer);
        this.debugLine.make(x, y);

        //this.setPosition(x, y);
        this.show();
    }

    public hide() {
        if (!this.loaded) { this.runAfterLoad.push(() => { this.hide(); }); return; }

        this.renderer.mainScene.remove(this.object);
        this.debugLine.hide();
    }

    public show() {
        if (!this.loaded) { this.runAfterLoad.push(() => { this.show(); }); return; }

        this.renderer.mainScene.add(this.object);
        this.debugLine.show();
    }

    public setColour(threeColor: Color) {
        if (!this.loaded) { this.runAfterLoad.push(() => { this.setColour(threeColor); }); return; }

        this.object.material = new THREE.MeshBasicMaterial( { color: threeColor} );
    }


    public setPosition(x,y) {
        if (!this.loaded) { this.runAfterLoad.push(() => { this.setPosition(x,y); }); return; }

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