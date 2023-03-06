import {AttackStateBuilder} from "./AttackStateBuilder";
import {Enemy, EnemyAiParams} from "../Enemy";
import {BehaviourBuilder, StateBuilder} from "../../../../behaviour/BehaviourBuilder";
import {CooldownManager} from "../../../../behaviour/CooldownManager";
import {SimpleProjectile} from "../../../projectiles/SimpleProjectile";
import PhysicsLayers from "../../../PhysicsLayers";
import {Theme} from "../../../../painting/Theme";
import {FunkyProjectileAnimationKeys} from "../../../../animations/ProjectileAnimationKeys";
import Vector2 = Phaser.Math.Vector2;

export class BulletHail extends AttackStateBuilder {

    private bulletsLeft: number;

    private readonly cooldownManager: CooldownManager;

    constructor(
        enemy: Enemy,
        id = "bullet_hail",
        fireRate = 0.3 * 1000,
        private readonly totalBullets = 7
    ) {
        super(id, enemy)

        this.bulletsLeft = totalBullets;

        const cds = new Map<string, number>();
        cds.set("shot", fireRate);
        this.cooldownManager = new CooldownManager(cds);
    }


    protected doSetup(stateBuilder: StateBuilder<EnemyAiParams>): void {
        stateBuilder.onUpdate((data, deltaTime) => this.update(data, deltaTime))
            .addTransition("aggro", (param, deltaTime) => this.done(param, deltaTime))
    }

    private done(param: EnemyAiParams, deltaTime: number): boolean {
        const done = this.bulletsLeft <= 0;

        if(done)
            this.bulletsLeft = this.totalBullets;

        return done;
    }

    private update(data: EnemyAiParams, deltaTime: number) {
        const hasCd = this.cooldownManager.has("shot");
        if(!hasCd)
            return;

        this.cooldownManager.use("shot");
        this.bulletsLeft--;

        this.enemy.projectileShooter.tryShoot(new Vector2(data.playerDir[0] / data.distanceToPlayer, data.playerDir[1] / data.distanceToPlayer));
    }

}
