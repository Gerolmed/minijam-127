import GameScene from "../../../scenes/Game";
import Vector2 = Phaser.Math.Vector2;
import {SimpleProjectile} from "../SimpleProjectile";
import PhysicsLayers from "../../PhysicsLayers";
import Transform = Phaser.GameObjects.Components.Transform;
import {ProjectileEntity} from "../ProjectileEntity";


export type ShooterConfig = {
    frequency: number;
    projectileSpeed: number;
    hitLayer?: number;
    selfLayer?: number;
    fireProjectile: (scene: GameScene, x: number, y: number, dir: Vector2, shooterConfig: ShooterConfig) => ProjectileEntity;
}

export class ProjectileShooter {

    private shootTimer = 0;
    private config: ShooterConfig = {
        frequency: .5,
        projectileSpeed: 3,
        hitLayer: PhysicsLayers.ENEMY,
        selfLayer: PhysicsLayers.PLAYER_PROJECTILE,
        fireProjectile: SimpleProjectile.fire
    }

    constructor(
        private readonly gameScene: GameScene,
        private readonly transform: Transform,
        config?: Partial<ShooterConfig>,
    ) {
        this.updateConfig(config);
        this.shootTimer = this.config.frequency;
    }

    updateConfig(config?: Partial<ShooterConfig>) {
        this.config = {
            ...this.config,
            ...config
        }

    }

    tryShoot(source: Vector2, input: Vector2): boolean {

        if(this.shootTimer < this.config.frequency) return false;

        this.shootTimer = 0;

        this.shoot(source, input);
        return true;
    }

    public shoot(source: Vector2, input: Vector2) {
        this.gameScene.addEntity(this.config.fireProjectile(this.gameScene, source.x, source.y, input, this.config));
    }

    update(deltaTime: number) {
        this.shootTimer += deltaTime;
    }
}
