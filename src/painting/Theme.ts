export enum Theme {
    ORANGE,
    PURPLE,

    DEFAULT
}


export const Themes: Theme[] = [Theme.DEFAULT, Theme.ORANGE, Theme.PURPLE];


export function getThemeTileset(theme: Theme): string {
    if(theme === Theme.DEFAULT) return "tileset"
    else if(theme === Theme.ORANGE) return "tileset_orange"
    else if(theme === Theme.PURPLE) return "tileset_purple"

    throw new Error("Tileset not defined for theme: " + theme)
}
