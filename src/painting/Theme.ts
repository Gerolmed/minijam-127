export enum Theme {
    ORANGE,

    DEFAULT
}


export const Themes: Theme[] = [Theme.ORANGE, Theme.DEFAULT];


export function getThemeTileset(theme: Theme): string {
    if(theme === Theme.DEFAULT) return "tileset"
    else if(theme === Theme.ORANGE) return "tileset_orange"

    throw new Error("Tileset not defined for theme: " + theme)
}
