import {Area} from "../world/Area";
import {Scene} from "phaser";
import {Layer, LayerType, Level} from "../types/Tilemap";
import {layerToIntGrid} from "./Layer";
import {ChunkParams} from "./ChunkParams";
import {getThemeTileset, Theme, Themes} from "../painting/Theme";
import {Entity} from "../entities/Entity";
import {PersistenceManager} from "../persistence/PersistenceManager";
import GameObject = Phaser.GameObjects.GameObject;
import RenderTexture = Phaser.GameObjects.RenderTexture;
import Sprite = Phaser.GameObjects.Sprite;
import Transform = Phaser.GameObjects.Components.Transform;
import BlendMode = Phaser.GameObjects.Components.BlendMode;
import Color = Phaser.Display.Color;

export class Chunk {


    private gameObjects: GameObject[] = [];
    private masks: Map<Theme, RenderTexture> = new Map();
    private maskOffsetX: number = 0;
    private maskOffsetY: number = 0;
    private entities: Entity[] = [];

    private readonly persistenceManager;

    constructor(private readonly area: Area, private readonly level: Level) {
        this.persistenceManager = PersistenceManager.get();
    }

    private physicsBodies: MatterJS.BodyType[] = []

    getArea(): Area {
        return this.area;
    }


    paint(object: GameObject & Transform, targetTheme: Theme) {
        Themes.forEach(theme => {
            if(theme === Theme.DEFAULT) return;

            if(!this.masks.has(theme))
                return;

            const mask = this.masks.get(theme)!;

            object.setPosition(object.x - this.maskOffsetX, object.y - this.maskOffsetY);

            if(theme === targetTheme) {
                mask.beginDraw();
                mask.batchDraw(object);
                mask.endDraw();
            } else {
                mask.erase(object)
            }

            object.setPosition(object.x + this.maskOffsetX, object.y + this.maskOffsetY);
        })
    }


    render(scene: Scene, params: ChunkParams) {
        const walls = params.tileEnums.getTiles("Wall")
        Themes.forEach(theme => {
            this.level.layerInstances.forEach(layer => {
                if (!this.masks.has(theme) && theme !== Theme.DEFAULT) {
                    const maskTexture = new RenderTexture(
                        scene,
                        this.level.worldX - 0.5 * layer.__gridSize,
                        this.level.worldY - 0.5 * layer.__gridSize,
                        layer.__cWid * layer.__gridSize,
                        layer.__cHei * layer.__gridSize
                    )
                    maskTexture.setOrigin(0, 0);
                    this.gameObjects.push(maskTexture);
                    this.masks.set(theme, maskTexture);
                }
                const mask = this.masks.get(theme);

                if(layer.__type === LayerType.Tiles)
                    this.processTileLayer(scene, params, layer, walls, theme, mask);
                else if(theme === Theme.DEFAULT && layer.__type === LayerType.Entity)
                    this.processEntityLayer(scene, params, layer);
            })
        })

        this.masks.forEach((mask, theme) => {
            this.loadMaskFromDB(mask, theme, scene);
        })
    }


    private getBlobKey(theme: Theme) {
        return "chunk_blobs:" + this.level.iid + ":" + theme;
    }

    private async loadMaskFromDB(mask: RenderTexture, theme: Theme, scene: Scene) {
        try {
            const chunk_blob_key = this.getBlobKey(theme);
            const imageSource = await this.persistenceManager.get(chunk_blob_key) as string;
            // console.log(imageSource)
            const image = new Image();
            image.loading = "eager";
            image.src = imageSource;

            await new Promise(resolve => {
                setTimeout(resolve, 50);
            })

            scene.textures.addImage(chunk_blob_key, image);

            const object = new Sprite(scene, 0, 0, chunk_blob_key);
            object.setOrigin(0, 0);
            mask.beginDraw();
            mask.batchDraw(object);
            mask.endDraw();

            scene.textures.remove(chunk_blob_key);
        } catch (e) {
            console.log(e);
        }
    }


    private processTileLayer(scene: Scene, params: ChunkParams, layer: Layer, walls: number[], theme: Theme, mask: RenderTexture | undefined) {
        const grid = layerToIntGrid(layer);
        this.maskOffsetX = this.level.worldX - 0.5 * layer.__gridSize;
        this.maskOffsetY = this.level.worldY - 0.5 * layer.__gridSize;
        const renderTexture = scene.add.renderTexture(
            this.maskOffsetX,
            this.maskOffsetY,
            layer.__cWid * layer.__gridSize,
            layer.__cHei * layer.__gridSize
        );
        renderTexture.setOrigin(0, 0);

        if(mask)
            renderTexture.setMask(mask.createBitmapMask());

        params.mapContainer.add(renderTexture);
        this.gameObjects.push(renderTexture);

        this.renderLayer(layer, scene, params, walls, grid, theme, renderTexture)
    }


    private processEntityLayer(scene: Scene, params: ChunkParams, layer: Layer) {
        layer.entityInstances.forEach(instance => {
            const factory = params.entityFactories.find(factory => factory.supports(instance.defUid));

            if(!factory)
                return;

            const entity = factory.produce(instance, layer, this.level.worldX, this.level.worldY, scene);
            if(!entity) return;
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

    async unload(scene: Scene) {
        this.physicsBodies.forEach(value => scene.matter.world.remove(value));

        const promises: Promise<any>[] = [];

        this.masks.forEach((mask, theme) => {
            mask.snapshot((blob: Color | HTMLImageElement) => {
                const source = (blob as HTMLImageElement).src;
                promises.push(this.persistenceManager.set(this.getBlobKey(theme), source));
            })
        })

        this.gameObjects.forEach(object => object.destroy(false));
        this.gameObjects = [];

        this.entities.forEach(entity => entity.isAlive && entity.destroy());
        this.entities = [];

        await Promise.all(promises);
    }

}
