export default class BrickLocation {
    rotation: number = 0;
    x: number = 0;
    y: number = 0;


    constructor(rotation: number, x: number, y: number) {
        this.rotation = rotation;
        this.x = x;
        this.y = y;
    }

    copy() : BrickLocation {
        return new BrickLocation(this.rotation, this.x, this.y);
    }
}
