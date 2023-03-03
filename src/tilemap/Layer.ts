import {Layer} from "../types/Tilemap";


function clamp(n: number): number {
    return n - (n % 1);
}

export function layerToIntGrid(layer: Layer): number[][] {
    const result: number[][] = [];
    for(let i = 0; i < layer.__cWid; i++) {
        result[i] = [];
    }

    layer.gridTiles.forEach(tile => {
        const x = clamp(tile.px[0] / layer.__gridSize);
        const y = clamp(tile.px[1] / layer.__gridSize);

        result[x][y] = tile.t;
    })

    return result;
}