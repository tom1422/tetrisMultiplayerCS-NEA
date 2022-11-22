import {Renderer} from "../Renderer";
import MeshGenerator from "../MeshGenerator";
import {Font} from "three/examples/jsm/loaders/FontLoader";
import {Object3D} from "three";
import wt2Font from "./wt2Font";
import wt2positionTranslator, {coordinate} from "./wt2positionTranslator";

export default class wt2Text {

    renderer: Renderer;

    object: Object3D;

    constructor(renderer: Renderer) {
        this.renderer = renderer;
    }

    make(x, y, height, text, font: wt2Font, align: number) {
        if (font.font == undefined) {
            //Wait for font
            font.loadCallback.push(() => {
                this.makeAndAdd(x, y, height, text, font, align);
            })
        } else {
            this.makeAndAdd(x, y, height, text, font, align);
        }

    }

    private makeAndAdd(x, y, height, text, font: wt2Font, align: number) {
        let newCoords: coordinate = wt2positionTranslator.translateCoordinates({x:x, y:y});
        this.object = MeshGenerator.drawText(newCoords.x, newCoords.y, height, text, font.font, align);
        this.renderer.mainScene.add(this.object);
    }

}