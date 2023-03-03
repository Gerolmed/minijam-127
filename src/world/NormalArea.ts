import {Area} from "./Area";
import {Chunk} from "../tilemap/Chunk";
import {Level} from "../types/Tilemap";

export class NormalArea implements Area {


    constructor(private level: Level) {
    }

    createChunkInstance(): Chunk {
        return new Chunk(this, this.level);
    }

    getNeighbours(): string[] {
        return this.level.__neighbours.map(neighbour => neighbour.levelIid);
    }

}
