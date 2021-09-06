export default class Size{
    w;
    h;
    constructor(w,h) {

        if (w < 0 || h < 0) console.warn(`Width or height can't be negative. Width ${w}, Height ${h}`);

        this.w = w;
        this.h = h;
    }

}