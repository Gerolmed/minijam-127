import {IEntityFactory} from "./IEntityFactory";
import {EntityInstance, Layer} from "../../types/Tilemap";
import {Entity} from "../Entity";
import {RatKing} from "../living/Enemies/RatKing";
import GameScene from "../../scenes/Game";
import {PhysicsSocket} from "../living/PhysicsSocket";
import Vector2 = Phaser.Math.Vector2;
import {WorldStoreManager} from "../../world/WorldSave";
import {Alpha} from "../living/Enemies/Alpha";
import {OpportunisticOpossum} from "../living/Enemies/OpportunisticOpossum";

export class BossFactory implements IEntityFactory {


    private readonly worldStore: WorldStoreManager;

    constructor(private readonly scene: GameScene,
                private readonly physicsSocket: PhysicsSocket,
                private readonly addEnemy: <T extends Entity>(enemy: T) => T) {
        this.worldStore = WorldStoreManager.get();
    }

    supports(typeID: number): boolean {
        return typeID === 79;
    }

    produce(instance: EntityInstance, layer: Layer, chunkX: number, chunkY: number, scene: Phaser.Scene): Entity {
        const type = instance.fieldInstances.find(field => field.__identifier === "Type");
        if(!type)
            throw new Error("Boss has no type");
        const enemyType = type.__value;

        const pos = new Vector2(instance.__grid[0] * layer.__gridSize + chunkX, instance.__grid[1] * layer.__gridSize + chunkY);

        const arena0 = instance.fieldInstances.find(instance => instance.__identifier === "Arena0")
        if(!arena0)
            throw new Error("Invalid arena bounds");
        const av0 = arena0.__value as {cx: number, cy: number};
        const topLeftCorner = new Vector2(av0.cx * layer.__gridSize + chunkX, av0.cy * layer.__gridSize + chunkY);

        const arena1 = instance.fieldInstances.find(instance => instance.__identifier === "Arena1")
        if(!arena1)
            throw new Error("Invalid arena bounds");
        const av1 = arena1.__value as {cx: number, cy: number};
        const botRightCorner = new Vector2(av1.cx * layer.__gridSize + chunkX, av1.cy * layer.__gridSize + chunkY);

        let boss = undefined;
        if(enemyType === "Ratking" && !this.worldStore.getStore().ratKingKilled) {
            boss = new RatKing(this.scene, this.physicsSocket, pos, topLeftCorner, new Vector2(botRightCorner.x - topLeftCorner.x,botRightCorner.y - topLeftCorner.y))
        } else if(enemyType === "Alpha" && !this.worldStore.getStore().ratKingKilled) {
            boss = new Alpha(this.scene, this.physicsSocket, pos, topLeftCorner, new Vector2(botRightCorner.x - topLeftCorner.x,botRightCorner.y - topLeftCorner.y))
        } else if(enemyType === "Opossum" && !this.worldStore.getStore().ratKingKilled) {
            boss = new OpportunisticOpossum(this.scene, this.physicsSocket, pos, topLeftCorner, new Vector2(botRightCorner.x - topLeftCorner.x,botRightCorner.y - topLeftCorner.y))
        }

        if(!boss)
            throw new Error("Unknown boss type: " + enemyType);

        return this.addEnemy(boss);
    }

}
