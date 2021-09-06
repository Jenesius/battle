export default class Coordinate{
    x;
    y;
    constructor(x,y = null) {

        if (y === null) {

            this.x = x.x;
            this.y = x.y;

            return;
        }

        this.x = x;
        this.y = y;
    }

}