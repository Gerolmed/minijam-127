enum LayerType {
    Tiles = "Tiles"
}



export type Tilemap = {
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

    gridTiles: GridTile[]
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
