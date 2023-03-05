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



export class EnemyFactory implements IEntityFactory {



    constructor(private readonly scene: GameScene,
                private readonly physicsSocket: PhysicsSocket,
                private readonly addEnemy: <T extends Entity>(enemy: T) => T) {
    }

    produce(instance: EntityInstance, layer: Layer, chunkX: number, chunkY: number, scene: Phaser.Scene): Entity {
        const type = instance.fieldInstances.find(field => field.__identifier === "Type");
        if(!type)
            throw new Error("Enemy has no type");

        const enemyType = type.__value;

        const pos = new Vector2(instance.__grid[0] * layer.__gridSize + chunkX, instance.__grid[1] * layer.__gridSize + chunkY);
        let enemy;
        if(enemyType === "Wolf")
            enemy = new Wolf(this.scene, this.physicsSocket, pos)
        else if(enemyType === "Rat")
            enemy = new Rat(this.scene, this.physicsSocket, pos)
        else if(enemyType === "Opossum")
            enemy = new Opossum(this.scene, this.physicsSocket, pos)

        if(!enemy)
            throw new Error("Invalid enemy type: " + enemyType);

        return this.addEnemy(enemy);
    }

    supports(typeID: number): boolean {
        return typeID === 47;
    }

}
