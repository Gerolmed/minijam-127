import {Area} from "./Area";
import {Chunk} from "../tilemap/Chunk";
import {Level} from "../types/Tilemap";

export class NormalArea implements Area {


    constructor(private level: Level) {
        level.layerInstances.reverse()
    }

    createChunkInstance(): Chunk {
        return new Chunk(this, this.level);
    }

    getNeighbours(): string[] {
        return this.level.__neighbours.map(neighbour => neighbour.levelIid);
    }

    getBounds(): { x: number; y: number; width: number; height: number } {
        const layer = this.level.layerInstances[0];
        return {
            x: this.level.worldX,
            y: this.level.worldY,
            width: layer.__cWid * layer.__gridSize,
            height: layer.__cHei * layer.__gridSize
        }
    }

}
