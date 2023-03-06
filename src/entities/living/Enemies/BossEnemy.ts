import {Enemy, EnemyAiParams, EnemyFacing} from "./Enemy";
import GameScene from "../../../scenes/Game";
import {PhysicsSocket} from "../PhysicsSocket";
import Vector2 = Phaser.Math.Vector2;
import {AABB} from "../../../util/AABB";
import {Jukebox} from "../../../audio/JukeBox";
import {BehaviourStateMachine} from "../../../behaviour/BehaviourStateMachine";
import {BehaviourBuilder} from "../../../behaviour/BehaviourBuilder";
import {CooldownManager} from "../../../behaviour/CooldownManager";
import {ProjectileRingShoot} from "./attacks/ProjectileRingShoot";
import {WorldStoreManager} from "../../../world/WorldSave";
import {BulletHail} from "./attacks/BulletHail";

export class BossEnemy extends Enemy {


    private isInCombat = false;

    private readonly cooldownManager: CooldownManager;

    private readonly APPROACH_RANGE = 120;
    private readonly BOSS_SPEED = 32;


    constructor(scene: GameScene,
                physicsSocket: PhysicsSocket,
                origin: Vector2,
                private readonly arenaTopLeft: Vector2,
                private readonly arenaSize: Vector2) {
        super(scene, physicsSocket, origin);

        const abilities = new Map<string, number>();
        abilities.set("attack", 1.5 * 1000);
        abilities.set("projectileRing", 6 * 1000);
        abilities.set("bulletHail", 4 * 1000);
        this.cooldownManager = new CooldownManager(abilities);
    }

    protected safeUpdate(deltaTime: number) {
        super.safeUpdate(deltaTime);

        const player = this.physicsSocket.getPlayer();
        if(!player)
            return;

        if(!this.isInCombat && AABB.isIn(player.x, player.y, this.arenaTopLeft.x, this.arenaTopLeft.y, this.arenaSize.x, this.arenaSize.y))
            this.startBossFight();
    }


    protected createBehaviour(): BehaviourStateMachine<EnemyAiParams> {
        return new BehaviourBuilder<EnemyAiParams>()
            .addState("neutral")
                .onUpdate((param) => this.setToOrigin())
                .addTransition("aggro", () => this.isInCombat)
                .and()
            .addState("aggro")
                .onUpdate((param, delta) => this.moveIntoAttackRange(param, delta))
                .addTransition("projectile_ring_shoot", (param, delta) => this.shouldDoProjectileRing(param, delta))
                .addTransition("bullet_hail", (param, delta) => this.shouldDoBulletHail(param, delta))
                .and()
            .addFromBuilder(new ProjectileRingShoot(this))
            .addFromBuilder(new BulletHail(this))
            .setStart("neutral")
            .setDataProvider(() => this.getAiParams())
            .build()
    }

    protected shouldDoProjectileRing(params: EnemyAiParams, deltaTime: number): boolean {
        const hasCd = this.cooldownManager.has("projectileRing") && this.cooldownManager.has("attack");
        const result = hasCd && params.distanceToPlayer <= this.APPROACH_RANGE;

        if(result) {
            this.cooldownManager.use("projectileRing");
            this.cooldownManager.use("attack");
        }

        return result;
    }


    protected shouldDoBulletHail(params: EnemyAiParams, deltaTime: number): boolean {
        const hasCd = this.cooldownManager.has("bulletHail") && this.cooldownManager.has("attack");

        if(hasCd) {
            this.cooldownManager.use("bulletHail");
            this.cooldownManager.use("attack");
        }

        return hasCd;
    }

    protected moveIntoAttackRange(param: EnemyAiParams, deltaTime: number) {
        if(!param.hasLos)
            return;

        if(param.distanceToPlayer > this.APPROACH_RANGE) {
            const velX = param.playerDir[0] / param.distanceToPlayer * this.BOSS_SPEED * deltaTime;
            const velY = param.playerDir[1] / param.distanceToPlayer * this.BOSS_SPEED * deltaTime;
            this.scene.matter.setVelocity(
                this.rigidbody,
                velX,
                velY
            )

            this.isWalking = true;
            this.updateFacing(velX, velY);
        } else {
            this.isWalking = false;
        }
    }

    protected shouldAttack(param: EnemyAiParams, deltaTime: number): boolean {
        if(param.distanceToPlayer > this.APPROACH_RANGE)
            return false;

        return this.cooldownManager.has("")
    }

    public shouldAggro(params: EnemyAiParams, deltaTime: number): boolean {
        return this.isInCombat;
    }

    private startBossFight() {
        this.isInCombat = true;
        this.gameScene.getJukebox().setTheme("");
        const sound = this.scene.sound.add("boss_intro");
        sound.setVolume(WorldStoreManager.get().getStore().masterVolume )
        sound.on("complete", () => {
            this.gameScene.getJukebox().setTheme("boss")
        })

        sound.play();
    }

}
