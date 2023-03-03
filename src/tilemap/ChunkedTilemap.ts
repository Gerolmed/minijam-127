import {Level, Tilemap} from "../types/Tilemap";
import {Scene} from "phaser";
import {AreaFactory} from "../world/AreaFactory";
import {Area} from "../world/Area";
import {Chunk} from "./Chunk";

export class ChunkedTilemap {

    private areas: Map<string, Area> = new Map();
    private loadedChunks: Chunk[] = [];

    constructor(map: Tilemap, areaFactory: AreaFactory) {
        map.levels.forEach(level => {
            this.areas.set(level.iid, areaFactory.produce(level));
        })
    }


    async enter(scene: Scene, area: Area) {
        const requiredAreas = [area];

        await this.load(scene, area);

        area.getNeighbours().forEach(neighbor => {
            const neighbourArea = this.areas.get(neighbor);
            if(!neighbourArea) return;

            requiredAreas.push(neighbourArea);
            this.load(scene, neighbourArea);
        })

        this.clean(scene, requiredAreas);
    }


    getAreas(): Area[] {
        const result: Area[] = [];
        for(const area of this.areas.values()) {
            result.push(area);
        }
        return result;
    }

    private async load(scene: Scene, area: Area) {
        const loadedChunk = this.loadedChunks.find(chunk => chunk.getArea() === area);

        if(!!loadedChunk) return;

        const chunk = area.createChunkInstance();
        chunk.render(scene);
    }

    private clean(scene: Scene, requiredChunks: Area[]) {
        const unloadChunks = this.loadedChunks.filter(chunk => !(requiredChunks.includes(chunk.getArea())));
        unloadChunks.forEach(chunk => chunk.unload(scene));
        this.loadedChunks = this.loadedChunks.filter(chunk => requiredChunks.includes(chunk.getArea()));
    }

}