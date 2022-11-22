export default class wt2positionTranslator {
    inWidth: number = 1;
    inHeight: number = 1;
    outWidth: number = 1;
    outHeight: number = 1;

    public static translateCoordinates(coords: coordinate) {
        let newCoords: coordinate = {x: 0, y: 0};
        newCoords.x = coords.x;
        newCoords.y = coords.y;
        return newCoords;
    }
}

export type coordinate = {
    x: number;
    y: number;
}