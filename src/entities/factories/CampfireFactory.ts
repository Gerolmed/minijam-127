import {IEntityFactory} from "./IEntityFactory";
import {Entity} from "../Entity";
import {EntityInstance, Layer} from "../../types/Tilemap";
import {PhysicsSocket} from "../living/PhysicsSocket";
import GameScene from "../../scenes/Game";
import {CampfireEntity} from "../living/interactibles/CampfireEntity";
import Vector2 = Phaser.Math.Vector2;


export class CampfireFactory implements IEntityFactory {

    constructor(private readonly scene: GameScene,
                private readonly physicsSocket: PhysicsSocket,
                private readonly addEntity: <T extends Entity>(entity: T) => T) {
    }

    produce(instance: EntityInstance, layer: Layer, chunkX: number, chunkY: number, scene: Phaser.Scene): Entity {

        const pos = new Vector2(
            instance.__grid[0] * layer.__gridSize + chunkX -1,
            instance.__grid[1] * layer.__gridSize + chunkY -18,
        );

        const fire = new CampfireEntity(this.scene, pos.x, pos.y, this.physicsSocket, instance.iid);

        return this.addEntity(fire);
    }

    supports(typeID: number): boolean {
        return typeID === 58;
    }

}
