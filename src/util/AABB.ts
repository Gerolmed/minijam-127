export class AABB {

    static isIn(x: number, y: number, bx: number, by: number, w: number, h: number): boolean {
        return !(bx > x ||
            by > y ||
            bx + w < x ||
            by + h < y)
    }

}
