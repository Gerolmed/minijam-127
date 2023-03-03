import {Area} from "../world/Area";
import {Scene} from "phaser";
import {Layer, Level} from "../types/Tilemap";
import {layerToIntGrid} from "./Layer";
import {ChunkParams} from "./ChunkParams";
import {getThemeTileset, Theme, Themes} from "../painting/Theme";
import GameObject = Phaser.GameObjects.GameObject;
import RenderTexture = Phaser.GameObjects.RenderTexture;
import Sprite = Phaser.GameObjects.Sprite;

export class Chunk {


    private gameObjects: GameObject[] = [];
    private masks: Map<Theme, RenderTexture> = new Map();

    constructor(private readonly area: Area, private readonly level: Level) {

    }

    private physicsBodies: MatterJS.BodyType[] = []

    getArea(): Area {
        return this.area;
    }


    paint(object: GameObject, theme: Theme) {
        if(!this.masks.has(theme))
            return;

        const mask = this.masks.get(theme)!;

        mask.beginDraw();
        mask.batchDraw(object);
        mask.endDraw();
    }


    render(scene: Scene, params: ChunkParams) {
        const walls = params.tileEnums.getTiles("Wall")
        this.level.layerInstances.forEach(layer => {
            const grid = layerToIntGrid(layer);
            Themes.forEach(theme => {
                const renderTexture = scene.add.renderTexture(
                    this.level.worldX - 0.5 * layer.__gridSize,
                    this.level.worldY - 0.5 * layer.__gridSize,
                    layer.__cWid * layer.__gridSize,
                    layer.__cHei * layer.__gridSize
                );
                renderTexture.setOrigin(0, 0);
                params.mapContainer.add(renderTexture);
                this.gameObjects.push(renderTexture);

                if(theme !== Theme.DEFAULT) {
                    const maskTexture = new RenderTexture(
                        scene,
                        this.level.worldX - 0.5 * layer.__gridSize,
                        this.level.worldY - 0.5 * layer.__gridSize,
                        layer.__cWid * layer.__gridSize,
                        layer.__cHei * layer.__gridSize
                    )
                    maskTexture.setOrigin(0,0);
                    this.gameObjects.push(maskTexture);

                    renderTexture.setMask(maskTexture.createBitmapMask());
                    this.masks.set(theme, maskTexture);
                }

                this.renderLayer(layer, scene, params, walls, grid, theme, renderTexture)
            })
        })
    }


    private renderLayer(layer: Layer, scene: Scene, params: ChunkParams, walls: number[], grid: number[][], theme: Theme, renderTexture: RenderTexture) {
        for(let x = 0; x < layer.__cWid; x++) {
            for(let y = 0; y < layer.__cHei; y++) {
                const index = grid[x][y];
                if(index == 0) continue;

                const sprite = new Sprite(
                    scene,
                    x * layer.__gridSize,
                    y * layer.__gridSize,
                    getThemeTileset(theme),
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
