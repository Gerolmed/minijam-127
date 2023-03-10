import {isProjectile, ProjectileEntity} from "./ProjectileEntity";
import GameScene from "../../scenes/Game";
import {isDamageable} from "../../damage/IDamageable";
import {ShooterConfig} from "./shooting/ProjectileShooter";
import {PlayerProjectileAnimationKeys, SimpleProjectileKeys} from "../../animations/ProjectileAnimationKeys";
import {Theme} from "../../painting/Theme";
import Vector2 = Phaser.Math.Vector2;
import Sprite = Phaser.GameObjects.Sprite;

function getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
}

export class SimpleProjectile extends ProjectileEntity {

    private aliveSince = 0;
    private lastPos = new Vector2();

    constructor(
        scene: GameScene, x?: number, y?: number,
        hitTeamMask?: number,
        selfMask?: number,
        private direction = new Vector2(1, 0),
        private readonly theme: Theme = Theme.ORANGE,
        private readonly ttl = 1.5,
        private readonly animationKeys: SimpleProjectileKeys = PlayerProjectileAnimationKeys,
        hitBoxSizeMod = 1,
    ) {
        super(scene, x, y, hitTeamMask, selfMask, hitBoxSizeMod);

        this.animator.load(this.animationKeys.BASE);
        this.animator.play(this.animationKeys.IDLE);
        this.lastPos = new Vector2(this.x, this.y);
    }

    setDirection(direction: Vector2) {
        this.direction = direction;
    }

    protected safeUpdate(deltaTime: number) {
        super.safeUpdate(deltaTime);


        const newPos = new Vector2(this.x, this.y);

        if(newPos.distanceSq(this.lastPos) > 150) {
            this.lastPos = newPos;
            const splashes = ["splat_6","splat_7","splat_8","splat_9"]
            this.gameScene.getTilemap().paint(new Sprite(this.scene,this.x,this.y, splashes[getRandomInt(splashes.length)]), this.theme)
        }


        if(this.aliveSince >= this.ttl) {
            this.destroy();
            return
        }

        this.aliveSince += deltaTime;

        this.scene.matter.setVelocity(this.rigidbody, this.direction.x, this.direction.y);
    }

    protected hit(other: Phaser.GameObjects.GameObject | undefined): boolean {

        if(!isProjectile(other)) {
            this.gameScene.getTilemap().paint(new Sprite(this.scene, this.x, this.y, "splat_2"), this.theme)
        }
        if(!isDamageable(other)) return true;

        other.damage(10);


        return super.hit(other);
    }

    static fire(scene: GameScene, x: number, y: number, dir: Vector2, shooterConfig: ShooterConfig){
        return new SimpleProjectile(scene, x, y, shooterConfig.hitLayer, shooterConfig.selfLayer, dir.scale(shooterConfig.projectileSpeed), shooterConfig.splashTheme, SimpleProjectile.ttlFromRangeAndSpeed(shooterConfig.range, shooterConfig.projectileSpeed), shooterConfig.projectileAnimKeys, shooterConfig.hitBoxSizeMod);
    }

    static enemyFire(scene: GameScene, x: number, y: number, dir: Vector2, shooterConfig: ShooterConfig) {
        return new SimpleProjectile(scene, x, y, shooterConfig.hitLayer, shooterConfig.selfLayer, dir.scale(shooterConfig.projectileSpeed), shooterConfig.splashTheme, SimpleProjectile.ttlFromRangeAndSpeed(shooterConfig.range, shooterConfig.projectileSpeed), shooterConfig.projectileAnimKeys, shooterConfig.hitBoxSizeMod);
    }

    static ttlFromRangeAndSpeed(range: number, speed: number) {
        return range * 3 / speed
    }

}
