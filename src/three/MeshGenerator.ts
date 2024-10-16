import * as THREE from 'three';
import {Font, FontLoader} from "three/examples/jsm/loaders/FontLoader";
import {TextGeometry} from "three/examples/jsm/geometries/TextGeometry";

export default class MeshGenerator {
    static generateRoundedBox(xIn, yIn, rIn, wIn, hIn): THREE.Mesh {
        let x = 0, y = 0, r = rIn, w = wIn - (rIn * 2), h = hIn - (rIn * 2);

        const heartShape = new THREE.Shape();

        //Point end fourth corner
        heartShape.moveTo( x + r, y );

        //Point start first corner
        heartShape.lineTo(x+r+w, y);

        //Radius first corner
        //heartShape.lineTo(x+r+w, y-r);
        heartShape.arc(0, -r, r, Math.PI / 2, 0, true);

        //Point end first corner
        heartShape.lineTo(x+2*r+w, y-r);

        //Point start second corner
        heartShape.lineTo(x+2*r+w,y-r-h);
        //Radius second corner
        //heartShape.lineTo(x+r+w,y-r-h);
        heartShape.arc(-r, 0, r, 0, -Math.PI / 2, true);
        //Point end second corner
        heartShape.lineTo(x+r+w,y-2*r-h);

        //Point start third corner
        heartShape.lineTo(x+r,y-2*r-h);
        //Radius third corner
        //heartShape.lineTo(x+r,y-r-h);
        heartShape.arc(0, r, r, -Math.PI / 2, -Math.PI, true);
        //Point end third corner
        heartShape.lineTo(x,y-r-h);

        //Point start fourth corner
        heartShape.lineTo(x,y-r);

        //radius fourth corner
        //heartShape.lineTo(x+r,y-r);
        heartShape.arc(r, 0, r, -Math.PI, Math.PI/2, true);

        const geometry = new THREE.ShapeGeometry( heartShape , 6);
        const material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );

        const edges = new THREE.EdgesGeometry( geometry );
        const line = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0xffffff } ) );

        const mesh = new THREE.Mesh(geometry, material) ;
        mesh.material = material;
        mesh.position.x = xIn;
        mesh.position.y = yIn;
        return mesh;
    }


    static generateRoundedBoxBorder(rIn, wIn, hIn, bor): THREE.Mesh[] {
        //First box needs to be wanted size. Second box needs to be bor diff on either side
        const group = [];
        group.push( this.generateRoundedBox(0, 0, rIn, wIn, hIn) );
        group.push( this.generateRoundedBox(bor, -bor, (rIn-bor < 0) ? 0 : rIn-bor, wIn-2*bor, hIn-2*bor) );
        return group;
    }

    static textGeo(height, text, font: Font, align: number): TextGeometry {
        if (font == undefined) return;
        const tGeometry = new TextGeometry( text, {
            font: font,
            size: height,
            height: 0,
            curveSegments: 1,
            bevelEnabled: false,
            bevelThickness: 0.5,
            bevelSize: 0.2,
            bevelOffset: 0,
            bevelSegments: 5
        } );

        //Change alignment
        tGeometry.computeBoundingBox();
        if (align == 1) {
            tGeometry.translate((tGeometry.boundingBox.min.x - tGeometry.boundingBox.max.x)/2, 0, 0);
        } else if (align == 2) {
            tGeometry.translate((tGeometry.boundingBox.min.x - tGeometry.boundingBox.max.x), 0, 0);
        }
        tGeometry.translate(0, ((tGeometry.boundingBox.min.y - tGeometry.boundingBox.max.y)/2), 0);
        //^^ vertical alignment is always central
        return tGeometry;
    }

    static drawText(height, text, font: Font, align: number): THREE.Mesh {

        const tGeometry = this.textGeo(height, text, font, align);

        const tMaterial = new THREE.MeshBasicMaterial( { color: 0x00ff00} );
        const textMesh = new THREE.Mesh( tGeometry, tMaterial );

        return textMesh;
    }

}