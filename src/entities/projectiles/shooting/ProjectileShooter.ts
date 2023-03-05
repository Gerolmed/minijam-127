import GameScene from "../../../scenes/Game";
import {SimpleProjectile} from "../SimpleProjectile";
import PhysicsLayers from "../../PhysicsLayers";
import {ProjectileEntity} from "../ProjectileEntity";
import {SimpleProjectileKeys, SplatsLarge, SplatsSmall} from "../../../animations/ProjectileAnimationKeys";
import {Theme} from "../../../painting/Theme";
import Vector2 = Phaser.Math.Vector2;
import Transform = Phaser.GameObjects.Components.Transform;


export type ShooterConfig = {
    frequency: number;
    projectileSpeed: number;
    // the large the more inaccurate
    accuracy: number; // TODO: implement this
    hitBoxSizeMod: number; // TODO: implement this
    projectiles: number; // TODO: implement this
    range: number;
    hasBackShot?: boolean; // TODO: implement this
    hasSideShots?: boolean; // TODO: implement this
    hitLayer?: number;
    selfLayer?: number;
    projectileAnimKeys?: SimpleProjectileKeys;
    splashTheme: Theme;
    splatsPath: string[];
    splatsExplode: string[];
    fireProjectile: (scene: GameScene, x: number, y: number, dir: Vector2, shooterConfig: ShooterConfig) => ProjectileEntity;
}

export class ProjectileShooter {

    private shootTimer = 0;
    private config: ShooterConfig;
    private readonly baseConfig: ShooterConfig;

    constructor(
        private readonly gameScene: GameScene,
        private readonly transform: Transform,
        config?: Partial<ShooterConfig>,
    ) {
        this.baseConfig = {
            frequency: .5,
            splashTheme: Theme.ORANGE,
            projectileSpeed: 3,
            projectiles: 1,
            accuracy: 0,
            splatsPath: SplatsSmall,
            splatsExplode: SplatsLarge,
            hitBoxSizeMod: 1,
            range: 1,
            hitLayer: PhysicsLayers.ENEMY,
            selfLayer: PhysicsLayers.PLAYER_PROJECTILE,
            fireProjectile: SimpleProjectile.fire,
            ...config
        };
        this.config = this.baseConfig;
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

    public getConfig() {
        return this.config
    }
    public getBaseConfig() {
        return this.baseConfig
    }

    public shoot(source: Vector2, input: Vector2) {
        this.gameScene.addEntity(this.config.fireProjectile(this.gameScene, source.x, source.y, input, this.config));
    }

    update(deltaTime: number) {
        this.shootTimer += deltaTime;
    }
}
