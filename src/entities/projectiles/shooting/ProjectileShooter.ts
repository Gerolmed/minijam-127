import GameScene from "../../../scenes/Game";
import {SimpleProjectile} from "../SimpleProjectile";
import PhysicsLayers from "../../PhysicsLayers";
import {ProjectileEntity} from "../ProjectileEntity";
import {SimpleProjectileKeys, SplatsLarge, SplatsSmall} from "../../../animations/ProjectileAnimationKeys";
import {Theme} from "../../../painting/Theme";
import {IShootSource} from "../../living/IShootSource";
import Vector2 = Phaser.Math.Vector2;
import Transform = Phaser.GameObjects.Components.Transform;


export type ShooterConfig = {
    frequency: number;
    projectileSpeed: number;
    // the large the more inaccurate
    accuracy: number;
    hitBoxSizeMod: number; // TODO: implement this
    projectiles: number;
    range: number;
    hasBackShot?: boolean;
    hasSideShots?: boolean;
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
        private readonly source: IShootSource,
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

    tryShoot(input: Vector2): boolean {

        if(this.shootTimer < this.config.frequency) return false;

        this.shootTimer = 0;

        this.shoot(input);
        return true;
    }

    public getConfig() {
        return this.config
    }
    public getBaseConfig() {
        return this.baseConfig
    }

    public shoot(input: Vector2) {



        for (let i = 0; i < this.config.projectiles; i++) {
            setTimeout(() => this.fireProjectile(input, input.clone()), 333 * i / this.config.projectileSpeed)
        }

        if(this.config.hasBackShot) {
            this.fireProjectile(input, input.clone().scale(-1));
        }
        if(this.config.hasSideShots) {
            this.fireProjectile(input, input.clone().rotate(30/180 * Math.PI));
            this.fireProjectile(input, input.clone().rotate(-30/180 * Math.PI));
        }
    }

    private fireProjectile(sourceDir: Vector2, input: Vector2) {

        if(!this.source.isAlive) return

        if(this.config.accuracy > 0) {
            let angle = 90 *  this.config.accuracy * Math.random();

            angle = Math.random() > .5 ? -angle : angle;

            input.rotate(angle/180 * Math.PI)
        }

        const shootPos = this.source.getShootPos(sourceDir);
        this.source.gameScene.addEntity(this.config.fireProjectile(this.source.gameScene, shootPos.x, shootPos.y, input, this.config));
    }



    update(deltaTime: number) {
        this.shootTimer += deltaTime;
    }
}
