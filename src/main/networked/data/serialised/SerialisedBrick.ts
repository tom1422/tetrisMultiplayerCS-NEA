import TetrisGrid from "../../../TetrisGrid";
import Brick from "../../../brick/Brick";
import RenderedBrick from "../../../brick/RenderedBrick";

export default class SerialisedBrick {

    //Current brick details
    rotation: number = 0;
    x: number = 0;
    y: number = 0;
    type: number = 0;

    constructor(brick: Brick, serialisedBrick?: SerialisedBrick) {
        //Constructing means sending to server - only send bare minimum
        if (serialisedBrick != undefined) {
            this.rotation = serialisedBrick.rotation;
            this.x = serialisedBrick.x;
            this.y = serialisedBrick.y;
            this.type = serialisedBrick.type;
        } else {
            this.rotation = brick.location.rotation;
            this.x = brick.location.x;
            this.y = brick.location.y;
            this.type = brick.brickType;
        }
    }

    public deserialise(): Brick {
        let brick = new Brick();
        brick.location.rotation = this.rotation;
        brick.location.x = this.x;
        brick.location.y = this.y;
        //brick.renderedBrick = new RenderedBrick(this.type, Math.floor(Math.random() * 4) + 1);
        return brick;
    }

}