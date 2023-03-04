import {Area} from "../world/Area";
import {Scene} from "phaser";
import {Layer, LayerType, Level} from "../types/Tilemap";
import {layerToIntGrid} from "./Layer";
import {ChunkParams} from "./ChunkParams";
import {getThemeTileset, Theme, Themes} from "../painting/Theme";
import GameObject = Phaser.GameObjects.GameObject;
import RenderTexture = Phaser.GameObjects.RenderTexture;
import Sprite = Phaser.GameObjects.Sprite;
import Transform = Phaser.GameObjects.Components.Transform;
import {Entity} from "../entities/Entity";

export class Chunk {


    private gameObjects: GameObject[] = [];
    private masks: Map<Theme, RenderTexture> = new Map();
    private maskOffsetX: number = 0;
    private maskOffsetY: number = 0;

    private entities: Entity[] = [];

    constructor(private readonly area: Area, private readonly level: Level) {

    }

    private physicsBodies: MatterJS.BodyType[] = []

    getArea(): Area {
        return this.area;
    }


    paint(object: GameObject & Transform, theme: Theme) {
        if(!this.masks.has(theme))
            return;

        const mask = this.masks.get(theme)!;

        object.setPosition(object.x - this.maskOffsetX, object.y - this.maskOffsetY);

        mask.beginDraw();
        mask.batchDraw(object);
        mask.endDraw();

        object.setPosition(object.x + this.maskOffsetX, object.y + this.maskOffsetY);
    }


    render(scene: Scene, params: ChunkParams) {
        const walls = params.tileEnums.getTiles("Wall")
        this.level.layerInstances.forEach(layer => {
            if(layer.__type === LayerType.Tiles)
                this.processTileLayer(scene, params, layer, walls);
            else if(layer.__type === LayerType.Entity)
                this.processEntityLayer(scene, params, layer);
        })
    }


    private processTileLayer(scene: Scene, params: ChunkParams, layer: Layer, walls: number[]) {
        const grid = layerToIntGrid(layer);
        Themes.forEach(theme => {
            this.maskOffsetX = this.level.worldX - 0.5 * layer.__gridSize;
            this.maskOffsetY = this.level.worldY - 0.5 * layer.__gridSize;

            const renderTexture = scene.add.renderTexture(
                this.maskOffsetX,
                this.maskOffsetY,
                layer.__cWid * layer.__gridSize,
                layer.__cHei * layer.__gridSize
            );
            renderTexture.setOrigin(0, 0);
            params.mapContainer.add(renderTexture);
            this.gameObjects.push(renderTexture);

            if (theme !== Theme.DEFAULT) {
                const maskTexture = new RenderTexture(
                    scene,
                    this.level.worldX - 0.5 * layer.__gridSize,
                    this.level.worldY - 0.5 * layer.__gridSize,
                    layer.__cWid * layer.__gridSize,
                    layer.__cHei * layer.__gridSize
                )
                maskTexture.setOrigin(0, 0);
                this.gameObjects.push(maskTexture);

                renderTexture.setMask(maskTexture.createBitmapMask());
                this.masks.set(theme, maskTexture);
            }

            this.renderLayer(layer, scene, params, walls, grid, theme, renderTexture)
        })
    }


    private processEntityLayer(scene: Scene, params: ChunkParams, layer: Layer) {
        layer.entityInstances.forEach(instance => {
            const factory = params.entityFactories.find(factory => factory.supports(instance.defUid));

            if(!factory)
                return;

            const entity = factory.produce(instance, scene);
            this.entities.push(entity);
        })
    }


    private renderLayer(layer: Layer, scene: Scene, params: ChunkParams, walls: number[], grid: number[][], theme: Theme, renderTexture: RenderTexture) {
        for(let x = 0; x < layer.__cWid; x++) {
            for(let y = 0; y < layer.__cHei; y++) {
                const index = grid[x][y];
                if(index == -1) continue;

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

                if(theme == Theme.DEFAULT) {
                    const physics = scene.matter.add.rectangle(
                        x * layer.__gridSize + this.level.worldX,
                        y * layer.__gridSize + this.level.worldY,
                        16, 16,
                        {
                            isStatic: true
                        }
                    );

                    this.physicsBodies.push(physics)
                }
            }
        }
    }


    getPhysicsBodies() {
        return this.physicsBodies;
    }

    unload(scene: Scene) {
        this.physicsBodies.forEach(value => scene.matter.world.remove(value));

        this.gameObjects.forEach(obj => console.log(obj));
        this.gameObjects.forEach(object => object.destroy(false));
        this.gameObjects = [];

        this.entities.forEach(entity => entity.destroy());
    }

}
