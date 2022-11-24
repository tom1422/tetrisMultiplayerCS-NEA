import {Renderer} from "../Renderer";
import MeshGenerator from "../MeshGenerator";
import {Font} from "three/examples/jsm/loaders/FontLoader";
import {Color, Mesh, Object3D} from "three";
import wt2Font from "./wt2Font";
import wt2positionTranslator, {coordinate} from "./wt2positionTranslator";
import * as THREE from "three";
import wt2Line from "./wt2Line";
import Coordinate from "../../main/other/Coordinate";
import {rectPosInfo} from "./wt2Rect";

export default class wt2Text {

    renderer: Renderer;

    object: Mesh;

    runAfterLoad: Function[] = [];
    loaded: boolean = false;

    debugLine: wt2Line;

    constructor(renderer: Renderer) {
        this.renderer = renderer;
    }

    make(posInfo: textPosInfo, text: string, font: wt2Font, align: number) {
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
        this.makeAndAdd(posInfo.pos, posInfo.height, text, font, align);
    }

    private makeAndAdd(pos: Coordinate, height: number, text: string, font: wt2Font, align: number) {
        if (!this.loaded) { this.runAfterLoad.push(() => { this.makeAndAdd(pos, height, text, font, align); }); return; }

        this.object = MeshGenerator.drawText(height, text, font.font, align);

        //Debug
        this.debugLine = new wt2Line(this.renderer);
        this.debugLine.make(pos);

        this.setPosition(pos);
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


    public setPosition(pos: Coordinate) {
        if (!this.loaded) { this.runAfterLoad.push(() => { this.setPosition(pos); }); return; }

        this.object.position.x = pos.x;
        this.object.position.y = pos.y;
        this.debugLine.setPosition(pos);
    }

    public setWeight(weight: number) {
        if (!this.loaded) { this.runAfterLoad.push(() => { this.setWeight(weight); }); return; }

        this.object.position.z = weight;
    }

}

export type textPosInfo = {
    pos: Coordinate;
    height: number;
}