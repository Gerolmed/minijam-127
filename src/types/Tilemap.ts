export enum LayerType {
    Tiles = "Tiles",
    Entity = "Entities"
}



export type Tilemap = {
    defs: TypeDef,
    entities: Entity[],
    levels: Level[]
}

type Entity = {

}

export type Level = {
    identifier: string,
    iid: string,
    uid: number,

    worldX: number,
    worldY: number,

    layerInstances: Layer[],

    __neighbours: Neighbour[]
}

export type Layer = {
    __identifier: string,
    __type: LayerType,
    __gridSize: number,
    __cWid: number,
    __cHei: number,

    gridTiles: GridTile[],

    entityInstances: EntityInstance[]
}

export type EntityInstance = {
    __grid: [number, number],
    __pivot: [number, number],
    "width": number,
    "height": number,
    defUid: number,
    iid: string
    fieldInstances: EntityFieldInstance[]
}

export type EntityFieldInstance = {
    __identifier: string,
    __value: string | {cx: number, cy: number} | any[] | boolean
}

export type Neighbour = {
    levelIid: string,
    dir: string
}

type GridTile = {
    px: [number, number],
    src: [number, number],
    f: number,
    t: number,
    d: [number]
}

type TypeDef = {
    tilesets: TilesetDef[]
}

export type TilesetDef = {
    identifier: string,
    enumTags: TilesetDefEnumValue[]
}

export type TilesetDefEnumValue = {
    enumValueId: string,
    tileIds: number[]
}
