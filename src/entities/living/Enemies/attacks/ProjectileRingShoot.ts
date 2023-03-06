import {Enemy, EnemyAiParams} from "../Enemy";
import {BehaviourBuilder, StateBuilder} from "../../../../behaviour/BehaviourBuilder";
import {AttackStateBuilder} from "./AttackStateBuilder";
import {SimpleProjectile} from "../../../projectiles/SimpleProjectile";
import PhysicsLayers from "../../../PhysicsLayers";
import {Theme} from "../../../../painting/Theme";
import {FunkyProjectileAnimationKeys} from "../../../../animations/ProjectileAnimationKeys";
import {sleep} from "../../../../util/TimeUtils";
import Vector2 = Phaser.Math.Vector2;

export class ProjectileRingShoot extends AttackStateBuilder{
    constructor(
        enemy: Enemy,
        private readonly onDone?: () => void,
        id = "projectile_ring_shoot",
    ) {
        super(id, enemy)
    }

    private done = false;
    private started = false;

    protected doSetup(stateBuilder: StateBuilder<EnemyAiParams>): void {
        stateBuilder.onUpdate((data, deltaTime) => this.update(data, deltaTime))
        stateBuilder.addTransition("aggro", data => this.checkDone())
    }

    private update(data: EnemyAiParams, deltaTime: number) {
        if(!this.started) this.start();
    }

    private checkDone() {
        if(!this.done) return false;
        this.done = false;
        this.started = false;
        return true;
    }

    private async start() {
        this.started = true;

        const count = 8;
        const angle = 360/ 8;
        const speed = 3;
        const bodyDist = 1.5;
        const range = 4;

        const spawnDir = new Vector2(0, bodyDist)


        const projectiles: [SimpleProjectile, Vector2][] = []

        for (let i = 0; i < count; i++) {
            spawnDir.rotate(angle/180 * Math.PI)
            const projectile = this.enemy.gameScene.addEntity(new SimpleProjectile(
                this.enemy.gameScene,
                spawnDir.x + this.enemy.x, spawnDir.y + this.enemy.y,
                PhysicsLayers.PLAYER,
                PhysicsLayers.ENEMY_PROJECTILE,
                new Vector2(),
                Theme.PURPLE,
                SimpleProjectile.ttlFromRangeAndSpeed(range, speed) + 70/1000 * (count-i),
                FunkyProjectileAnimationKeys
            ))
            projectiles.push([projectile, spawnDir.clone()])
            await sleep(70)
        }
        await sleep(70)

        projectiles.filter(projectile => projectile[0].isAlive).forEach(projectile => projectile[0].setDirection(projectile[1].scale(speed)))
        this.done = true;
        this.onDone?.()
    }
}
