import Container = Phaser.GameObjects.Container;

export enum Color {
    ORANGE,
    TEST1,

    DEFAULT
}


export const Colors: Color[] = [Color.ORANGE, Color.DEFAULT, Color.TEST1];


export function getColorTileset(color: Color): string {
    if(color === Color.DEFAULT) return "tileset"
    else if(color === Color.ORANGE) return "tileset"

    return "tileset"

    throw new Error("Tileset not defined for color: " + color)
}
