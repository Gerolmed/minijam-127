import {Area} from "../world/Area";
import {Scene} from "phaser";
import {Layer, Level} from "../types/Tilemap";
import {layerToIntGrid} from "./Layer";
import {ChunkParams} from "./ChunkParams";
import GameObject = Phaser.GameObjects.GameObject;
import {Color, Colors, getColorTileset} from "../painting/Color";
import Container = Phaser.GameObjects.Container;
import RenderTexture = Phaser.GameObjects.RenderTexture;
import Sprite = Phaser.GameObjects.Sprite;

export class Chunk {


    private gameObjects: GameObject[] = [];

    constructor(private readonly area: Area, private readonly level: Level) {

    }

    private physicsBodies: MatterJS.BodyType[] = []

    getArea(): Area {
        return this.area;
    }

    render(scene: Scene, params: ChunkParams) {
        const walls = params.tileEnums.getTiles("Wall")
        this.level.layerInstances.forEach(layer => {
            const grid = layerToIntGrid(layer);
            Colors.forEach(color => {
                const renderTexture = scene.add.renderTexture(
                    this.level.worldX - 0.5 * layer.__gridSize,
                    this.level.worldY - 0.5 * layer.__gridSize,
                    layer.__cWid * layer.__gridSize,
                    layer.__cHei * layer.__gridSize
                );
                renderTexture.setOrigin(0, 0);
                params.mapContainer.add(renderTexture);
                this.gameObjects.push(renderTexture);

                const sprite = new Sprite(
                    scene,
                    0,
                    0,
                    "tileset",
                    1
                )

                renderTexture.setMask(sprite.createBitmapMask())

                this.renderLayer(layer, scene, params, walls, grid, color, renderTexture)
            })
        })
    }


    private renderLayer(layer: Layer, scene: Scene, params: ChunkParams, walls: number[], grid: number[][], color: Color, renderTexture: RenderTexture) {
        for(let x = 0; x < layer.__cWid; x++) {
            for(let y = 0; y < layer.__cHei; y++) {
                const index = grid[x][y];
                if(index == 0) continue;

                const sprite = new Sprite(
                    scene,
                    x * layer.__gridSize,
                    y * layer.__gridSize,
                    getColorTileset(color),
                    index
                )
                sprite.setOrigin(0, 0);

                renderTexture.beginDraw();
                renderTexture.batchDraw(sprite);
                renderTexture.endDraw();

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
    }

    unload(scene: Scene) {
        this.physicsBodies.forEach(value => scene.matter.world.remove(value));

        this.gameObjects.forEach(object => object.destroy(true));
        this.gameObjects = [];
    }

}
