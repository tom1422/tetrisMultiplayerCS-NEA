import {
    BufferGeometry,
    Mesh,
    OrthographicCamera,
    ShaderMaterial,
    UniformsUtils,
    WebGLRenderer,
    WebGLRenderTarget
} from "three";
import * as THREE from 'three';
import {FXAAShader} from "three/examples/jsm/shaders/FXAAShader";

export default class AAShader {
    uniforms: any;
    private material: ShaderMaterial;
    private _camera: OrthographicCamera;
    private _geometry: BufferGeometry;
    private _mesh: Mesh<any, any>;

    constructor() {
        this.uniforms = UniformsUtils.clone(FXAAShader.uniforms);

        this.material = new ShaderMaterial({defines: {}, uniforms: this.uniforms, vertexShader: FXAAShader.vertexShader, fragmentShader: FXAAShader.fragmentShader});

        this._camera = new THREE.OrthographicCamera( - 1, 1, 1, - 1, 0, 1 );
        this._geometry = new THREE.BufferGeometry();
        this._geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( [ - 1, 3, 0, - 1, - 1, 0, 3, - 1, 0 ], 3 ) );
        this._geometry.setAttribute( 'uv', new THREE.Float32BufferAttribute( [ 0, 2, 0, 0, 2, 0 ], 2 ) );
        this._mesh = new THREE.Mesh(this._geometry, this.material);
    }

    render(renderer: WebGLRenderer, readBuffer: WebGLRenderTarget) {
        this.uniforms['tDiffuse'].value = readBuffer.texture;
        renderer.render(this._mesh, this._camera);
    }
}