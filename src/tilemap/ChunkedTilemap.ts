import {Level, Tilemap} from "../types/Tilemap";
import {Scene} from "phaser";
import {AreaFactory} from "../world/AreaFactory";
import {Area} from "../world/Area";
import {Chunk} from "./Chunk";
import Container = Phaser.GameObjects.Container;
import {TileTagStore} from "./TileTagStore";
import GameObject = Phaser.GameObjects.GameObject;
import {Theme} from "../painting/Theme";
import Transform = Phaser.GameObjects.Components.Transform;
import {IEntityFactory} from "../entities/factories/IEntityFactory";


export class ChunkedTilemap {

    private areas: Map<string, Area> = new Map();

    private readonly tileTagStore: TileTagStore;
    private readonly mapContainer: Container;

    private loadedChunks: Chunk[] = [];
    private currentArea?: Area;

    private readonly entityFactories: IEntityFactory[] = [];


    constructor(map: Tilemap, areaFactory: AreaFactory, private readonly scene: Scene) {
        map.levels.forEach(level => {
            this.areas.set(level.iid, areaFactory.produce(level));
        })

        this.tileTagStore = new TileTagStore(map.defs.tilesets);
        this.mapContainer = scene.add.container(0, 0);
    }


    setPlayerPosition(x: number, y: number) {
        if(!(this.currentArea) || this.isPositionIn(x, y, this.currentArea))
            return;

        this.areas.forEach(area => {
            if(this.isPositionIn(x, y, area)) {
                this.currentArea = area;
                this.enter(area);
            }
        })
    }


    private isPositionIn(x: number, y: number, area: Area): boolean {
        const currentBounds = area.getBounds();

        return !(currentBounds.x > x ||
            currentBounds.y > y ||
            currentBounds.x + currentBounds.width < x ||
            currentBounds.y + currentBounds.height < y)
    }

    async enter(area: Area) {
        this.currentArea = area;
        const requiredAreas = [area];

        await this.load(area);

        area.getNeighbours().forEach(neighbor => {
            const neighbourArea = this.areas.get(neighbor);
            if(!neighbourArea) return;

            requiredAreas.push(neighbourArea);
            this.load(neighbourArea);
        })

        this.clean(requiredAreas);
    }


    getAreas(): Area[] {
        const result: Area[] = [];
        for(const area of this.areas.values()) {
            result.push(area);
        }
        return result;
    }

    getCurrentArea(): Area | undefined {
        return this.currentArea;
    }

    paint(obj: GameObject & Transform, theme: Theme) {
        this.loadedChunks.forEach(chunk => chunk.paint(obj, theme));
    }

    getPhysicsBodies(): MatterJS.BodyType[] {
        const result: MatterJS.BodyType[] = [];
        this.loadedChunks.map(chunk => chunk.getPhysicsBodies()).forEach(arr => result.push(...arr));
        return result;
    }

    registerEntityFactory(entityFactory: IEntityFactory) {
        this.entityFactories.push(entityFactory);
    }

    private async load(area: Area): Promise<Chunk> {
        const loadedChunk = this.loadedChunks.find(chunk => chunk.getArea() === area);

        if(!!loadedChunk) return loadedChunk;

        const chunk = area.createChunkInstance();
        chunk.render(this.scene, {
            mapContainer: this.mapContainer,
            tileEnums: this.tileTagStore,
            hasPhysics: true,
            entityFactories: this.entityFactories
        });

        this.loadedChunks.push(chunk);
        return chunk;
    }


    async unloadAllChunks() {
        await this.clean([]);
    }

    private async clean(requiredChunks: Area[]) {
        const promises: Promise<any>[] = [];

        const unloadChunks = this.loadedChunks.filter(chunk => !(requiredChunks.includes(chunk.getArea())));
        unloadChunks.forEach(chunk => {
            promises.push(chunk.unload(this.scene));
        });
        this.loadedChunks = this.loadedChunks.filter(chunk => requiredChunks.includes(chunk.getArea()));

        promises.push(new Promise(resolve => {
            setTimeout(resolve, 1);
        }))

        await Promise.all(promises);
    }

}
