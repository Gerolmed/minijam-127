import {IEntityFactory} from "./IEntityFactory";
import {Entity} from "../Entity";
import {EntityInstance, Layer} from "../../types/Tilemap";
import {Wolf} from "../living/Enemies/Wolf";
import {Rat} from "../living/Enemies/Rat";
import {Opossum} from "../living/Enemies/Opossum";
import {Scene} from "phaser";
import {PhysicsSocket} from "../living/PhysicsSocket";
import Vector2 = Phaser.Math.Vector2;
import GameScene from "../../scenes/Game";
import {Enemy} from "../living/Enemies/Enemy";
import {NPCEntity} from "../living/interactibles/NPCEntity";
import {Item} from "../../items/Item";
import {ItemEntity} from "../../items/ItemEntity";
import ItemRegistry from "../../items/ItemRegistry";
import {PersistenceManager} from "../../persistence/PersistenceManager";
import {WorldStoreManager} from "../../world/WorldSave";



export class ItemFactory implements IEntityFactory {

    private readonly worldStore: WorldStoreManager;

    constructor(private readonly scene: GameScene,
                private readonly addEntity: <T extends Entity>(entity: T) => T) {
        this.worldStore = WorldStoreManager.get();
    }

    produce(instance: EntityInstance, layer: Layer, chunkX: number, chunkY: number, scene: Phaser.Scene): Entity | undefined {
        const itemID = instance.fieldInstances.find(field => field.__identifier === "ItemID")!.__value as string;

        const pos = new Vector2(instance.__grid[0] * layer.__gridSize + chunkX, instance.__grid[1] * layer.__gridSize + chunkY);
        const item = ItemRegistry.getItem(itemID);

        if(!item) {
            console.error(`Failed to find registered item with ID '${itemID}'`)
            return undefined;
        }

        const worldStoreEntryName = "hasItem:" + instance.iid;
        if(this.worldStore.getStore().raw[worldStoreEntryName])
            return undefined;

        this.worldStore.getStore().raw[worldStoreEntryName] = true;

        return this.addEntity(new ItemEntity(this.scene, pos.x, pos.y, item));
    }

    supports(typeID: number): boolean {
        return typeID === 61;
    }

}
