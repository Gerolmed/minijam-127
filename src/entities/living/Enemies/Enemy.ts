import {LivingEntity} from "../LivingEntity";
import {PhysicsSocket} from "../PhysicsSocket";
import {ICollisionData} from "matter";
import GameScene from "../../../scenes/Game";
import PhysicsLayers from "../../PhysicsLayers";
import {ProjectileShooter} from "../../projectiles/shooting/ProjectileShooter";
import {EnemyHealthBar} from "../../../ui/EnemyHealthBar";
import {Animator} from "../../../animations/Animator";
import {Theme} from "../../../painting/Theme";
import Vector2 = Phaser.Math.Vector2;
import {SpinnyProjectileAnimationKeys} from "../../../animations/ProjectileAnimationKeys";


export enum EnemyState {
    NEUTRAL,
    AGGRO,
    RETREATING
}

export enum EnemyFacing {
    LEFT,
    RIGHT,
    TOP,
    DOWN
}

export class Enemy extends LivingEntity {


    protected readonly projectileShooter: ProjectileShooter;


    private readonly SPEED = 42;
    private readonly RETREAT_SPEED = 70;
    private readonly ATTACK_RANGE = 100;
    private readonly AGGRO_RANGE = 150;
    private readonly AGGRO_RANGE_ORIGIN = 100;
    private readonly PATIENCE = 3 * 1000;
    private readonly FOLLOW_DISTANCE = 300;
    private readonly RETREAT_DISTANCE_MAX = 400;
    private readonly RETREAT_DURATION_MAX = 10 * 1000;

    private lastPlayerSpotted = Date.now();
    private startRetreating = 0;
    private aState: EnemyState = EnemyState.NEUTRAL;
    private facing: EnemyFacing = EnemyFacing.DOWN;


    constructor(scene: GameScene,
                protected readonly physicsSocket: PhysicsSocket,
                protected readonly origin: Vector2) {
        super(scene, origin.x, origin.y);

        this.facing = EnemyFacing.DOWN;
        this.projectileShooter = new ProjectileShooter(scene, this, {
            selfLayer: PhysicsLayers.ENEMY_PROJECTILE,
            hitLayer: PhysicsLayers.PLAYER,
            projectileSpeed: 1.5,
            frequency: 0.6,
            splashTheme: Theme.PURPLE,
            projectileAnimKeys: SpinnyProjectileAnimationKeys
        });
    }


    protected safeUpdate(deltaTime: number) {
        super.safeUpdate(deltaTime);

        this.projectileShooter.update(deltaTime);
    }

    protected move(deltaTime: number, animator: Animator) {
        super.safeUpdate(deltaTime);

        const player = this.physicsSocket.getPlayer();
        if(!player) return;

        const hasLos = this.hasLineOfSight();
        const playerDir = [player.x - this.x, player.y - this.y];
        const distanceToPlayer = Math.sqrt(playerDir[0] * playerDir[0] + playerDir[1] * playerDir[1]);
        const distanceToOrigin = Math.sqrt((this.x - this.origin.x) * (this.x - this.origin.x) + (this.y - this.origin.y) * (this.y - this.origin.y));
        const timeLastSpotted = Date.now() - this.lastPlayerSpotted;
        let moving = false;

        // this.projectileShooter.shoot(new Vector2(this.x, this.y), new Vector2(playerDir[0], playerDir[1]));

        if(hasLos)
            this.lastPlayerSpotted = Date.now();

        if(this.aState === EnemyState.AGGRO && (distanceToOrigin> this.FOLLOW_DISTANCE || timeLastSpotted > this.PATIENCE)) {
            this.aState = EnemyState.RETREATING;
            this.startRetreating = Date.now();
        }
        const timeRetreating = Date.now() - this.startRetreating;

        if(this.aState !== EnemyState.AGGRO && distanceToPlayer < this.AGGRO_RANGE && distanceToOrigin < this.AGGRO_RANGE_ORIGIN)
            this.aState = EnemyState.AGGRO;

        if(this.aState === EnemyState.AGGRO && hasLos) {
            if(distanceToPlayer > this.ATTACK_RANGE) {
                const velX = playerDir[0] / distanceToPlayer * this.SPEED * deltaTime;
                const velY = playerDir[1] / distanceToPlayer * this.SPEED * deltaTime;
                this.scene.matter.setVelocity(
                    this.rigidbody,
                    velX,
                    velY
                )

                moving = true;
                this.updateFacing(velX, velY);
            } else {
                // this.projectileShooter.tryShoot(new Vector2(this.x, this.y), new Vector2(playerDir[0] / distanceToPlayer, playerDir[1] / distanceToPlayer));
            }
        }

        if(this.aState === EnemyState.RETREATING) {
            const velX = -playerDir[0] / distanceToPlayer * this.RETREAT_SPEED * deltaTime;
            const velY = -playerDir[1] / distanceToPlayer * this.RETREAT_SPEED * deltaTime;
            this.scene.matter.setVelocity(
                this.rigidbody,
                velX,
                velY
            )

            moving = true;
            this.updateFacing(velX, velY);
        }
        if(this.aState === EnemyState.RETREATING && (distanceToOrigin > this.RETREAT_DISTANCE_MAX || timeRetreating > this.RETREAT_DURATION_MAX)) {
            this.aState = EnemyState.NEUTRAL;
        }

        if(this.aState === EnemyState.NEUTRAL) {
            this.scene.matter.body.setPosition(this.rigidbody, new Vector2(this.origin.x, this.origin.y));

            this.facing = EnemyFacing.DOWN;
        }

        this.animator.play(this.getAnimationFrame(this.facing, moving? "WALK" : "IDLE"));
    }

    private updateFacing(velX: number, velY: number) {
        const horizontal = Math.abs(velX) > Math.abs(velY);

        if(horizontal) {
            if(velX < 0) {
                this.facing = EnemyFacing.LEFT;
            } else {
                this.facing = EnemyFacing.RIGHT;
            }
        } else {
            if(velY < 0) {
                this.facing = EnemyFacing.TOP;
            } else {
                this.facing = EnemyFacing.DOWN;
            }
        }
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


    getAnimationFrame(facing: EnemyFacing, animation: "WALK" | "IDLE"): string {
        return "";
    }

}
