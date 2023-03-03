import {Area} from "../world/Area";
import {Scene} from "phaser";
import {Level} from "../types/Tilemap";
import {layerToIntGrid} from "./Layer";
import {ChunkParams} from "./ChunkParams";
import GameObject = Phaser.GameObjects.GameObject;
import {Color, Colors, getColorTileset} from "../painting/Color";
import Container = Phaser.GameObjects.Container;

export class Chunk {


    private gameObjects: GameObject[] = [];

    constructor(private readonly area: Area, private readonly level: Level) {

    }

    private physicsBodies: MatterJS.BodyType[] = []

    getArea(): Area {
        return this.area;
    }

    render(scene: Scene, params: ChunkParams) {
        const colorContainers = new Map<Color, Container>();
        Colors.forEach(color => {
            const container = scene.add.container(0, 0);
            colorContainers.set(color, container);
            params.colorContainer.get(color)!.add(container);
            this.gameObjects.push(container);
        })

        const walls = params.tileEnums.getTiles("Wall")
        this.level.layerInstances.forEach(layer => {
            const grid = layerToIntGrid(layer);

            for(let x = 0; x < layer.__cWid; x++) {
                for(let y = 0; y < layer.__cHei; y++) {
                    const index = grid[x][y];
                    if(index == 0) continue;

                    Colors.forEach(color =>  {
                        const sprite = scene.add.sprite(
                            x * layer.__gridSize + this.level.worldX,
                            y * layer.__gridSize + this.level.worldY,
                            getColorTileset(color),
                            index
                        )

                        colorContainers.get(color)!.add(sprite);
                    });

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

        this.gameObjects.forEach(object => object.destroy(true));
        this.gameObjects = [];
    }

}
