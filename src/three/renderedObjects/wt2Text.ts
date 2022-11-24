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
    height: number;
    align: number;
    font: Font;

    runAfterLoad: Function[] = [];
    waiting: boolean = true;

    debugLine: wt2Line;

    constructor(renderer: Renderer) {
        this.renderer = renderer;
    }

    make(posInfo: textPosInfo, text: string, font: wt2Font, align: number) {
        if (font.font == undefined) {
            //Wait for font
            this.waiting = true;
            font.loadCallback.push(() => {
                this.waiting = false;
                this.runAfterLoad.forEach((value) => {
                    value();
                });
            })
        } else {
            this.waiting = false;
        }
        this.makeAndAdd(posInfo.pos, posInfo.height, text, font, align);
    }

    private makeAndAdd(pos: Coordinate, height: number, text: string, font: wt2Font, align: number) {
        if (this.waiting) { this.runAfterLoad.push(() => { this.makeAndAdd(pos, height, text, font, align); }); return; }


        this.object = MeshGenerator.drawText(height, text, font.font, align);
        this.height = height;
        this.align = align;
        this.font = font.font;

        //Debug
        this.debugLine = new wt2Line(this.renderer);
        this.debugLine.make(pos);

        this.setPosition(pos);
        this.show();
    }

    public hide() {
        if (this.waiting) { this.runAfterLoad.push(() => { this.hide(); }); return; }

        this.renderer.mainScene.remove(this.object);
        this.debugLine.hide();
    }

    public show() {
        if (this.waiting) { this.runAfterLoad.push(() => { this.show(); }); return; }

        this.renderer.mainScene.add(this.object);
        this.debugLine.show();
    }

    public setColour(threeColor: Color) {
        if (this.waiting) { this.runAfterLoad.push(() => { this.setColour(threeColor); }); return; }

        this.object.material = new THREE.MeshBasicMaterial( { color: threeColor} );
    }


    public setPosition(pos: Coordinate) {
        if (this.waiting) { this.runAfterLoad.push(() => { this.setPosition(pos); }); return; }

        this.object.position.x = pos.x;
        this.object.position.y = pos.y;
        this.debugLine.setPosition(pos);
    }

    public setWeight(weight: number) {
        if (this.waiting) { this.runAfterLoad.push(() => { this.setWeight(weight); }); return; }

        this.object.position.z = weight;
    }

    public setText(newText: string) {
        if (this.waiting) { this.runAfterLoad.push(() => { this.setText(newText); }); return; }

        this.object.geometry = MeshGenerator.textGeo(this.height, newText, this.font, this.align);
    }

}

export type textPosInfo = {
    pos: Coordinate;
    height: number;
}