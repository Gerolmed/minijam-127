import {Chunk} from "../tilemap/Chunk";

export interface Area {

    createChunkInstance(): Chunk;

    getNeighbours(): string[];

    getBounds(): {x: number, y: number, width: number, height: number}

}
