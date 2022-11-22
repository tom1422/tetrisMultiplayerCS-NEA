import {Renderer} from "../Renderer";
import MeshGenerator from "../MeshGenerator";
import {Font} from "three/examples/jsm/loaders/FontLoader";
import {Object3D} from "three";
import wt2Font from "./wt2Font";

export default class wt2Text {

    renderer: Renderer;

    object: Object3D;

    constructor(renderer: Renderer) {
        this.renderer = renderer;
    }

    make(x, y, text, font: wt2Font, align: number) {
        if (font == undefined) {
            //Wait for font
            font.loadCallback.push(() => {
                this.object = MeshGenerator.drawText(x, y, text, font.font, align);
            })
        } else {
            this.object = MeshGenerator.drawText(x, y, text, font.font, align);
        }
        this.renderer.mainScene.add(this.object);
    }

}