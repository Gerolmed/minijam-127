import {Area} from "../world/Area";
import {Scene} from "phaser";
import {Level} from "../types/Tilemap";
import {layerToIntGrid} from "./Layer";
import Sprite = Phaser.GameObjects.Sprite;
import Container = Phaser.GameObjects.Container;
import {ChunkParams} from "./ChunkParams";
import BitmapMask = Phaser.Display.Masks.BitmapMask;
import RenderTexture = Phaser.GameObjects.RenderTexture;

export class Chunk {

    constructor(private readonly area: Area, private readonly level: Level) {

    }

    private physicsBodies: MatterJS.BodyType[] = []

    getArea(): Area {
        return this.area;
    }

    render(scene: Scene, params: ChunkParams) {
        const container = scene.add.container(0, 0);
        params.mapContainer.add(container);
        const walls = params.tileEnums.getTiles("Wall")
        this.level.layerInstances.forEach(layer => {
            const grid = layerToIntGrid(layer);

            for(let x = 0; x < layer.__cWid; x++) {
                for(let y = 0; y < layer.__cHei; y++) {
                    const index = grid[x][y];
                    if(index == 0) continue;
                    const sprite = scene.add.sprite(x * layer.__gridSize + this.level.worldX, y * layer.__gridSize + this.level.worldY, "tileset", index)
                    container.add(sprite);

                    if(!params.hasPhysics || !walls.includes(index)) continue;

                    const physics = scene.matter.add.rectangle(
                        x * layer.__gridSize + this.level.worldX,
                        y * layer.__gridSize + this.level.worldY,
                        16, 16 ,
                        {
                            isStatic: true
                        }
                    );

                    this.physicsBodies.push(physics)
                }
            }
        })
    }

    unload(scene: Scene) {
        this.physicsBodies.forEach(value => scene.matter.world.remove(value));
    }

}
