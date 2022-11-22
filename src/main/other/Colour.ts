export default class Colour {
    r: number = 0;
    g: number = 0;
    b: number = 0;
    a: number = 0;
    constructor(r: number, g: number, b: number, a?: number) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = (a == undefined ? 255 : a);
    }

}