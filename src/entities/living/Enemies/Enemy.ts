import {LivingEntity} from "../LivingEntity";
import {PhysicsSocket} from "../PhysicsSocket";
import Vector2 = Phaser.Math.Vector2;
import {ICollisionData} from "matter";
import GameScene from "../../../scenes/Game";
import PhysicsLayers from "../../PhysicsLayers";

export class Enemy extends LivingEntity {


    constructor(scene: GameScene, x: number, y: number, protected readonly physicsSocket: PhysicsSocket) {
        super(scene, x, y);
    }


    protected raycast(): Array<ICollisionData> {
        const player = this.physicsSocket.getPlayer();
        if(!player)
            return [];

        const worldPhysicsBodies = this.physicsSocket.getTileBodies();

        // @ts-ignore
        return Phaser.Physics.Matter.Matter.Query.ray(worldPhysicsBodies, new Vector2(this.x, this.y), new Vector2(player.x, player.y));
    }

    protected hasLineOfSight(): boolean {
        const collisions = this.raycast();
        return collisions.length === 0;
    }

    protected getPhysicsLayer(): number {
        return PhysicsLayers.ENEMY;
    }

}
