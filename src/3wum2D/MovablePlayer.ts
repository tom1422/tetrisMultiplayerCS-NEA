import {PerspectiveCamera} from "three";
import {PointerLockControls} from "three/examples/jsm/controls/PointerLockControls";

export default class MovablePlayer {

    playerCam: PerspectiveCamera;

    forwardVel: number = 0;
    rightVel: number = 0;

    pointerLockControls: PointerLockControls;

    constructor(playerCam: PerspectiveCamera) {
        this.playerCam = playerCam;

        this.pointerLockControls = new PointerLockControls( this.playerCam, document.body );
        this.pointerLockControls.addEventListener( 'lock', function () {

            console.log("locked")

        } );

        this.pointerLockControls.addEventListener( 'unlock', function () {

            console.log("unlocked!")

        } );
        window.addEventListener( 'click', () => {

            this.pointerLockControls.lock();

        } );

        document.addEventListener( 'keydown', (event) => {switch ( event.code ) {
            case 'ArrowUp':
            case 'KeyW':
                this.forwardVel = 1;
                break;

            case 'ArrowLeft':
            case 'KeyA':
                this.rightVel = -1;
                break;

            case 'ArrowDown':
            case 'KeyS':
                this.forwardVel = -1;
                break;

            case 'ArrowRight':
            case 'KeyD':
                this.rightVel = 1;
                break;
        } });
        document.addEventListener( 'keyup', (event) => {switch ( event.code ) {
            case 'ArrowUp':
            case 'KeyW':
                if (this.forwardVel > 0) {
                    this.forwardVel = 0;
                }
                break;

            case 'ArrowLeft':
            case 'KeyA':
                if (this.rightVel < 0) {
                    this.rightVel = 0;
                }
                break;

            case 'ArrowDown':
            case 'KeyS':
                if (this.forwardVel < 0) {
                    this.forwardVel = 0;
                }
                break;

            case 'ArrowRight':
            case 'KeyD':
                if (this.rightVel > 0) {
                    this.rightVel = 0;
                }
                break;
        } });
    }

    update() {
        this.pointerLockControls.moveForward(this.forwardVel);
        this.pointerLockControls.moveRight(this.rightVel);
    }
}