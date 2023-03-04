import GameScene from "../../../scenes/Game";
import Vector2 = Phaser.Math.Vector2;
import {SimpleProjectile} from "../SimpleProjectile";
import PhysicsLayers from "../../PhysicsLayers";
import Transform = Phaser.GameObjects.Components.Transform;


type ShooterConfig = {
    frequency: number;
    projectileSpeed: number;
}

export class ProjectileShooter {

    private shootTimer = 0;
    private config: ShooterConfig = {
        frequency: 1,
        projectileSpeed: 4,
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

    tryShoot(input: Vector2): boolean {


        if(this.shootTimer < this.config.frequency) return false;

        this.shootTimer = 0;

        this.shoot(input);
        return true;
    }

    public shoot(input: Vector2) {
        this.gameScene.addEntity(new SimpleProjectile(this.gameScene, this.transform.x, this.transform.y, PhysicsLayers.ENEMY, input.scale(this.config.projectileSpeed)))

    }

    update(deltaTime: number) {
        this.shootTimer += deltaTime;
    }
}
