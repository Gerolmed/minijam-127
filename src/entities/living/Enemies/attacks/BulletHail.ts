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


    private readonly TOTAL_BULLETS = 7;

    private bulletsLeft: number = this.TOTAL_BULLETS;

    private readonly cooldownManager: CooldownManager;

    constructor(
        enemy: Enemy,
        id = "bullet_hail",
    ) {
        super(id, enemy)

        const cds = new Map<string, number>();
        cds.set("shot", 0.3);
        this.cooldownManager = new CooldownManager(cds);
    }


    protected doSetup(stateBuilder: StateBuilder<EnemyAiParams>): void {
        stateBuilder.onUpdate((data, deltaTime) => this.update(data, deltaTime))
            .addTransition("aggro", (param, deltaTime) => this.done(param, deltaTime))
    }

    private done(param: EnemyAiParams, deltaTime: number): boolean {
        const done = this.bulletsLeft <= 0;

        if(done)
            this.bulletsLeft = this.TOTAL_BULLETS;

        return done;
    }

    private update(data: EnemyAiParams, deltaTime: number) {
        const hasCd = this.cooldownManager.has("shot");
        if(!hasCd)
            return;

        this.cooldownManager.use("shot");
        this.bulletsLeft--;

        const player = this.enemy.physicsSocket.getPlayer();
        if(!player)
            return;

        this.enemy.projectileShooter.tryShoot(new Vector2(player.x, player.y));
    }

}
