import {Renderer} from "../Renderer";
import {Color, Group, Mesh, Object3D} from "three";
import MeshGenerator from "../MeshGenerator";
import wt2positionTranslator, {coordinate} from "./wt2positionTranslator";
import * as THREE from "three";
import Colour from "../../main/other/Colour";
import wt2Line from "./wt2Line";
import Coordinate from "../../main/other/Coordinate";
import {RenderedGrid} from "../../main/renderer/SpecificRenderers/GridRenderer";

export default class wt2Grid {

    renderer: Renderer;

    object: Group;
    cells: wt2GridMeshCell[][] = [];

    debugLine: wt2Line;

    zeroIsTransparent: boolean;

    constructor(renderer: Renderer) {
        this.renderer = renderer;
    }

    make(posInfo: gridPosInfo, grid: number[][], zeroIsTransparent?: boolean) {
        this.zeroIsTransparent = zeroIsTransparent;
        let gridArray = grid;
        this.object = new THREE.Group();
        const zInterval = (0.9 / (gridArray.length * gridArray[0].length))
        let curZ = 0;
        for (let i: number = 0; i < gridArray.length; i++) {
            this.cells[i] = [];
            for (let j: number = 0; j < gridArray[i].length; j++) {
                let obj1 = MeshGenerator.generateRoundedBoxBorder(posInfo.boxRadius, posInfo.boxWidth, posInfo.boxHeight, 1/20);
                this.object.add(obj1[0])
                this.object.add(obj1[1])
                this.cells[i][j] = new wt2GridMeshCell(obj1[0], obj1[1]);
                this.cells[i][j].background.position.x = (posInfo.boxWidth + posInfo.boxRadius) * i;
                this.cells[i][j].background.position.y = (posInfo.boxHeight + posInfo.boxRadius) * -j;
                this.cells[i][j].background.position.z = curZ;
                this.cells[i][j].foreground.position.x = (posInfo.boxWidth + posInfo.boxRadius) * i;
                this.cells[i][j].foreground.position.y = (posInfo.boxHeight + posInfo.boxRadius) * -j;
                this.cells[i][j].foreground.position.z = curZ + zInterval/2;

                curZ += zInterval
            }
        }

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

    public setColours(colorGrid: Color[][]) {
        if (colorGrid == undefined) return;
        for (let i: number = 0; i < colorGrid.length; i++) {
            for (let j: number = 0; j < colorGrid[i].length; j++) {
                let square = this.cells[i][j]

                if (square == undefined) continue;

                if (colorGrid[i][j] == undefined && this.zeroIsTransparent) {
                    square.foreground.material = new THREE.MeshBasicMaterial( { color: 0x000000 } );
                    square.background.material = new THREE.MeshBasicMaterial( { color: 0x000000 } );
                    square.foreground.material.transparent = true;
                    square.foreground.material.opacity = 0;
                    square.background.material.transparent = true;
                    square.background.material.opacity = 0;
                } else {
                    square.foreground.material = new THREE.MeshBasicMaterial( { color: colorGrid[i][j] } );
                    let strokeCol: Color = colorGrid[i][j];
                    strokeCol.r -= (20/255);
                    strokeCol.g -= (20/255);
                    strokeCol.b -= (20/255);
                    square.background.material = new THREE.MeshBasicMaterial( { color: colorGrid[i][j] } );
                }
            }
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

export type gridPosInfo = {
    pos: Coordinate;
    boxWidth?: number;
    boxHeight?: number;
    boxRadius?: number;
}

export class wt2GridMeshCell {
    background: Mesh;
    foreground: Mesh;

    constructor(background, foreground) {
        this.background = background;
        this.foreground = foreground;
    }
}