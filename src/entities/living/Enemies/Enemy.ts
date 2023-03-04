import {LivingEntity} from "../LivingEntity";
import {PhysicsSocket} from "../PhysicsSocket";
import Vector2 = Phaser.Math.Vector2;
import {ICollisionData} from "matter";
import GameScene from "../../../scenes/Game";
import PhysicsLayers from "../../PhysicsLayers";
import {ProjectileShooter} from "../../projectiles/shooting/ProjectileShooter";
import {EnemyHealthBar} from "../../../ui/EnemyHealthBar";

export class Enemy extends LivingEntity {


    protected readonly projectileShooter: ProjectileShooter;

    constructor(scene: GameScene, x: number, y: number, protected readonly physicsSocket: PhysicsSocket) {
        super(scene, x, y);

        this.projectileShooter = new ProjectileShooter(scene, this);
    }


    protected safeUpdate(deltaTime: number) {
        super.safeUpdate(deltaTime);

        this.projectileShooter.update(deltaTime);
    }
    create() {
        super.create();
        const healthBar = new EnemyHealthBar(this.scene, this.getHealthBarOffset())
        this.setHandler(healthBar);
        this.add(healthBar)
    }

    protected getHealthBarOffset() {
        return new Vector2(0,-20);
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
