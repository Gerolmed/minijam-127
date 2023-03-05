import {LivingEntity} from "../LivingEntity";
import {PhysicsSocket} from "../PhysicsSocket";
import {ICollisionData} from "matter";
import GameScene from "../../../scenes/Game";
import PhysicsLayers from "../../PhysicsLayers";
import {ProjectileShooter} from "../../projectiles/shooting/ProjectileShooter";
import {EnemyHealthBar} from "../../../ui/EnemyHealthBar";
import {Animator} from "../../../animations/Animator";
import {Theme} from "../../../painting/Theme";
import {SpinnyProjectileAnimationKeys} from "../../../animations/ProjectileAnimationKeys";
import {IShootSource} from "../IShootSource";
import Vector2 = Phaser.Math.Vector2;
import {BehaviourStateMachine} from "../../../behaviour/BehaviourStateMachine";
import {BehaviourBuilder} from "../../../behaviour/BehaviourBuilder";


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

/*

hasLos = this.hasLineOfSight();
        const playerDir = [player.x - this.x, player.y - this.y];
        const distanceToPlayer = Math.sqrt(playerDir[0] * playerDir[0] + playerDir[1] * playerDir[1]);
        const distanceToOrigin = Math.sqrt((this.x - this.origin.x) * (this.x - this.origin.x) + (this.y - this.origin.y) * (this.y - this.origin.y));
        const timeLastSpotted = Date.now() - this.lastPlayerSpotted;
 */

type EnemyAiParams = {
    hasLos: boolean,
    playerDir: [number, number],
    distanceToPlayer: number,
    distanceToOrigin: number,
    timeLastSpotted: number
}

export class Enemy extends LivingEntity implements IShootSource {


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
    private isWalking = false;

    private readonly behaviour: BehaviourStateMachine<EnemyAiParams>;


    constructor(scene: GameScene,
                protected readonly physicsSocket: PhysicsSocket,
                protected readonly origin: Vector2) {
        super(scene, origin.x, origin.y);

        this.facing = EnemyFacing.DOWN;
        this.projectileShooter = new ProjectileShooter(this, this, {
            selfLayer: PhysicsLayers.ENEMY_PROJECTILE,
            hitLayer: PhysicsLayers.PLAYER,
            projectileSpeed: 1.5,
            frequency: 0.6,
            splashTheme: Theme.PURPLE,
            projectileAnimKeys: SpinnyProjectileAnimationKeys
        });

        this.behaviour = new BehaviourBuilder<EnemyAiParams>()
            .addState("neutral")
                .onUpdate((param) => this.setToOrigin())
                .and()
            .addState("aggro")
                .onUpdate((param, delta) => this.moveIntoAttackRange(param, delta))
                .and()
            .addState("retreat")
                .onUpdate((param, delta) => this.retreat(param, delta))
                .and()
            .setStart("neutral")
            .setDataProvider(() => this.getAiParams())
            .build()
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


        if(this.aState === EnemyState.RETREATING && (distanceToOrigin > this.RETREAT_DISTANCE_MAX || timeRetreating > this.RETREAT_DURATION_MAX)) {
            this.aState = EnemyState.NEUTRAL;
        }

        this.animator.play(this.getAnimationFrame(this.facing, moving? "WALK" : "IDLE"));
    }


    protected getAiParams(): EnemyAiParams {
        const player = this.physicsSocket.getPlayer();
        if(!player)
            throw new Error("No player specified");

        const playerDir = [player.x - this.x, player.y - this.y];

        return {
            hasLos: this.hasLineOfSight(),
            playerDir: [player.x - this.x, player.y - this.y],
            distanceToPlayer: Math.sqrt(playerDir[0] * playerDir[0] + playerDir[1] * playerDir[1]),
            distanceToOrigin: Math.sqrt((this.x - this.origin.x) * (this.x - this.origin.x) + (this.y - this.origin.y) * (this.y - this.origin.y)),
            timeLastSpotted: Date.now() - this.lastPlayerSpotted
        }
    }

    protected setToOrigin() {
        this.scene.matter.body.setPosition(this.rigidbody, new Vector2(this.origin.x, this.origin.y));
        this.facing = EnemyFacing.DOWN;
    }


    protected retreat(param: EnemyAiParams, deltaTime: number) {
        const velX = -param.playerDir[0] / param.distanceToPlayer * this.RETREAT_SPEED * deltaTime;
        const velY = -param.playerDir[1] / param.distanceToPlayer * this.RETREAT_SPEED * deltaTime;
        this.scene.matter.setVelocity(
            this.rigidbody,
            velX,
            velY
        )

        this.isWalking = true;
        this.updateFacing(velX, velY);
    }


    protected moveIntoAttackRange(param: EnemyAiParams, deltaTime: number) {
        if(!param.hasLos)
            return;

        if(param.distanceToPlayer > this.ATTACK_RANGE) {
            const velX = param.playerDir[0] / param.distanceToPlayer * this.SPEED * deltaTime;
            const velY = param.playerDir[1] / param.distanceToPlayer * this.SPEED * deltaTime;
            this.scene.matter.setVelocity(
                this.rigidbody,
                velX,
                velY
            )

            this.isWalking = true;
            this.updateFacing(velX, velY);
        } else {
            this.projectileShooter.tryShoot(new Vector2(param.playerDir[0] / param.distanceToPlayer, param.playerDir[1] / param.distanceToPlayer));
        }
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

    getShootPos(dir: Vector2): Vector2 {
        return new Vector2(this.x, this.y).add(this.getShootDirOffset(dir))
    }

    private getShootDirOffset(input: Vector2) {
        if(input.y < 0) return new Vector2(0, -15)

        return new Vector2(input.x * 7,0)
    }
}
