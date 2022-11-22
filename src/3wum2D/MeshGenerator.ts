import * as THREE from "three";
import {FontLoader} from "three/examples/jsm/loaders/FontLoader";
import {TextGeometry} from "three/examples/jsm/geometries/TextGeometry";

export default class MeshGenerator {
    static generateRoundedBox(xIn, yIn, rIn, wIn, hIn, col) {
        const x = xIn, y = yIn, r = rIn, w = wIn - (rIn * 2), h = hIn - (rIn * 2);

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
        const material = new THREE.MeshBasicMaterial( { color: col } );

        const edges = new THREE.EdgesGeometry( geometry );
        const line = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0xffffff } ) );

        const mesh = new THREE.Mesh(geometry, material) ;
        this.mainScene.add( mesh );
    }

    static drawText(x, y, text) {
        const loader = new FontLoader();
        this.testText = undefined;

        loader.load( 'assets/ComicSansMS_Regular.json', ( font ) => {
            console.log("Font loaded");

        });

        const tGeometry = new TextGeometry( 'Comic Sans MS. ', {
            font: font,
            size: 5,
            height: 2,
            curveSegments: 20,
            bevelEnabled: false,
            bevelThickness: 0.5,
            bevelSize: 0.2,
            bevelOffset: 0,
            bevelSegments: 5
        } );
        const tMaterial = new THREE.MeshBasicMaterial( { color: 0x004200} );
        this.testText = new THREE.Mesh( tGeometry, tMaterial );
        this.mainScene.add(this.testText);

        tGeometry.computeBoundingBox();
        this.testText.position.x = (tGeometry.boundingBox.min.x - tGeometry.boundingBox.max.x)/2;
        console.log((tGeometry.boundingBox.min.x - tGeometry.boundingBox.max.x)/2)
    }

}