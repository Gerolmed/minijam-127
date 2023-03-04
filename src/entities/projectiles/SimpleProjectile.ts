import {ProjectileEntity} from "./ProjectileEntity";
import GameScene from "../../scenes/Game";
import Vector2 = Phaser.Math.Vector2;
import {isDamageable} from "../../damage/IDamageable";
import {ShooterConfig} from "./shooting/ProjectileShooter";
import {PlayerProjectileAnimationKeys} from "../../animations/ProjectileAnimationKeys";

export class SimpleProjectile extends ProjectileEntity {

    private aliveSince = 0;

    constructor(
        scene: GameScene, x?: number, y?: number,
        hitTeamMask?: number,
        private readonly direction = new Vector2(1, 0),
        private readonly ttl = 6,
    ) {
        super(scene, x, y, hitTeamMask);

        this.animator.load(PlayerProjectileAnimationKeys.BASE);
        this.animator.play(PlayerProjectileAnimationKeys.IDLE);
    }

    protected safeUpdate(deltaTime: number) {
        super.safeUpdate(deltaTime);


        if(this.aliveSince >= this.ttl) {
            this.destroy();
            return
        }

        this.aliveSince += deltaTime;

        this.scene.matter.setVelocity(this.rigidbody, this.direction.x, this.direction.y);
    }

    protected hit(other: Phaser.GameObjects.GameObject | undefined): boolean {
        if(!isDamageable(other)) return true;

        other.damage(10);

        return super.hit(other);
    }

    static fire(scene: GameScene, x: number, y: number, dir: Vector2, shooterConfig: ShooterConfig){
        return new SimpleProjectile(scene, x, y, shooterConfig.hitLayer, dir.scale(shooterConfig.projectileSpeed));
    }
}
