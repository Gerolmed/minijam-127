import {Chunk} from "../tilemap/Chunk";

export interface Area {

    createChunkInstance(): Chunk;

    getNeighbours(): string[];

}
