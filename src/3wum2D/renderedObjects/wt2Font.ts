import {Renderer} from "../Renderer";
import {Font} from "three/examples/jsm/loaders/FontLoader";

export default class wt2Font {

    font: Font;
    renderer: Renderer;

    public loadCallback: Function[];

    constructor(renderer: Renderer, fontLocation: string) {
        this.renderer = renderer;
        this.renderer.fontLoader.load( fontLocation, ( font ) => {
            this.font=font;
            this.loadCallback.forEach((value) => {
                value();
            });
        });
    }

}