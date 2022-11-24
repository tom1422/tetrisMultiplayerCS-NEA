export default class UsefulUtils {
    static generate2DNumberArray(width: number, height: number, fill?: boolean): number[][] {
        let gridArray = [];
        for (let i: number = 0; i < width; i++) {
            gridArray[i] = [];
            if (fill) {
                for (let j: number = 0; j < height; j++) {
                    gridArray[i][j] = 0;
                }
            }
        }
        return gridArray;
    }
}