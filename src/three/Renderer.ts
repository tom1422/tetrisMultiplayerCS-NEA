import {
    Loader,
    Mesh,
    OrthographicCamera,
    PerspectiveCamera,
    Scene,
    ShaderMaterial,
    UniformsUtils, Vector2,
    WebGLRenderer,
    WebGLRenderTarget
} from "three";
import * as THREE from 'three';
import {EffectComposer, FullScreenQuad} from "three/examples/jsm/postprocessing/EffectComposer";
import {ShaderPass} from "three/examples/jsm/postprocessing/ShaderPass";
import {FXAAShader} from "three/examples/jsm/shaders/FXAAShader";
import {RenderPass} from "three/examples/jsm/postprocessing/RenderPass";
import {Font, FontLoader} from "three/examples/jsm/loaders/FontLoader";
import {TextGeometry} from "three/examples/jsm/geometries/TextGeometry";
import AAShader from "./AAShader";
import {PointerLockControls} from "three/examples/jsm/controls/PointerLockControls";
import MovablePlayer from "./MovablePlayer";
import MeshGenerator from "./MeshGenerator";
import wumThree2D from "./wumThree2D";
import wt2Font from "./renderedObjects/wt2Font";
import wt2Text from "./renderedObjects/wt2Text";
import wt2Rect from "./renderedObjects/wt2Rect";
import Coordinate from "../main/other/Coordinate";


export class Renderer {

    mainScene: Scene;
    renderer: WebGLRenderer;
    readBuffer: WebGLRenderTarget;
    aaShader: AAShader;

    camera1: OrthographicCamera;
    camera2: PerspectiveCamera;

    movablePlayer: MovablePlayer;

    fontLoader: FontLoader;
    fonts: wt2Font[] = [];

    wumThree2D: wumThree2D;

    constructor() {
        console.log("created class!!!")
        this.setup();

        //More setup stuff
        this.fontLoader = new FontLoader();
        this.loadFonts();
        //this.movablePlayer = new MovablePlayer(this.camera2);

        //Even more setup stuff
        this.wumThree2D = new wumThree2D(this);

        this.animate();

        this.camera1.position.z = 20;
    }

    setup() {
        //Create scene
        this.mainScene = new THREE.Scene();

        //Create WebGL Renderer
        this.renderer = new THREE.WebGLRenderer();
        //Not 100% needed as it only applies when the css pixel size is not same as screen pixel size
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.autoClear = false;
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        //Create camera
        this.camera1 = new THREE.OrthographicCamera( -2, 2, 2, -2, 1, 1000 );

        //Create camera 2
        this.camera2 = new THREE.PerspectiveCamera(50, 1, 0.1, 2000);

        //Create FXAA Shader
        this.aaShader = new AAShader();

        //Make read buffer for shaders etc
        const size = this.renderer.getSize( new Vector2() );
        const _pixelRatio = this.renderer.getPixelRatio();
        const _width = size.width;
        const _height = size.height;
        this.readBuffer = new WebGLRenderTarget( _width * _pixelRatio, _height * _pixelRatio );
        this.readBuffer.texture.name = 'test';
        
        //Finish
        document.body.appendChild( this.renderer.domElement );

        //Resize
        window.addEventListener('resize', this.onWindowResize.bind(this));
        this.onWindowResize();
    }

    onWindowResize() {
        const pixelRatio = this.renderer.getPixelRatio();

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.readBuffer.setSize(window.innerWidth * pixelRatio, window.innerHeight * pixelRatio);

        let width = window.innerWidth / 40;
        let height = window.innerHeight / 40;
        this.camera1.left = width * -1;
        this.camera1.right = width;
        this.camera1.top = height;
        this.camera1.bottom = height * -1;
        // this.camera1.left = -window.innerWidth;
        // this.camera1.right = window.innerWidth;
        // this.camera1.top = window.innerHeight;
        // this.camera1.bottom = -window.innerHeight;
        this.camera1.updateProjectionMatrix();

        this.camera2.aspect = width / height;
        this.camera2.updateProjectionMatrix();

        this.aaShader.uniforms[ 'resolution' ].value.x = 1 / ( window.innerWidth * pixelRatio );
        this.aaShader.uniforms[ 'resolution' ].value.y = 1 / ( window.innerHeight * pixelRatio );
    }


    animate() {
        requestAnimationFrame(this.animate.bind(this));

        //this.movablePlayer.update();

        if (this.wumThree2D.animFunction!== undefined) {
            this.wumThree2D.animFunction();
        }

        this.renderer.setRenderTarget(this.readBuffer);
        this.renderer.clear();
        this.renderer.render(this.mainScene, this.camera1);

        this.renderer.clearDepth();
        //this.renderer.render(this.mainScene, this.camera2);

        this.renderer.setClearColor(0x87CEFA);
        this.renderer.setClearAlpha(1);

        this.renderer.setRenderTarget(null);
        this.aaShader.render(this.renderer, this.readBuffer);
    }

    loadFonts() {
        this.fonts.push(new wt2Font(this, "assets/ComicSansMS_Regular.json"))

    }
}