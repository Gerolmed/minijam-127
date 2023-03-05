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
import {CampfireEntity} from "../living/interactibles/CampfireEntity";



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

        const fire = new CampfireEntity(this.scene, pos.x, pos.y, this.physicsSocket);

        return this.addEntity(fire);
    }

    supports(typeID: number): boolean {
        return typeID === 58;
    }

}