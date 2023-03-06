import {Enemy, EnemyFacing} from "./Enemy";
import {WolfAnimationKeys} from "../../../animations/EnemyAnimationKeys";
import Vector2 = Phaser.Math.Vector2;
import {ProjectileShooter} from "../../projectiles/shooting/ProjectileShooter";
import PhysicsLayers from "../../PhysicsLayers";
import {Theme} from "../../../painting/Theme";
import {SpinnyProjectileAnimationKeys} from "../../../animations/ProjectileAnimationKeys";


export class Wolf extends Enemy {


    create() {
        super.create();

        this.animator.load(WolfAnimationKeys.BASE);
        this.animator.play(WolfAnimationKeys.IDLE_DOWN);

        this.physicsOffset = new Vector2(-1,-2);
    }

    protected safeUpdate(deltaTime: number) {
        super.safeUpdate(deltaTime);
    }

    getAnimationFrame(facing: EnemyFacing, animation: "WALK" | "IDLE"): string {
        if(facing === EnemyFacing.LEFT) {
            return animation === "WALK" ? WolfAnimationKeys.WALK_LEFT : WolfAnimationKeys.IDLE_LEFT;
        } else if(facing === EnemyFacing.DOWN) {
            return animation === "WALK" ? WolfAnimationKeys.WALK_DOWN : WolfAnimationKeys.IDLE_DOWN;
        } else if(facing === EnemyFacing.RIGHT) {
            return animation === "WALK" ? WolfAnimationKeys.WALK_RIGHT : WolfAnimationKeys.IDLE_RIGHT;
        } else if(facing === EnemyFacing.TOP) {
            return animation === "WALK" ? WolfAnimationKeys.WALK_UP : WolfAnimationKeys.IDLE_UP;
        }

        throw new Error("Invalid animation frame");
    }



    async playDeathAnim(): Promise<void> {
        return new Promise(resolve => this.animator.play(WolfAnimationKeys.DEATH, 2, true, resolve))
    }

    protected createProjectileConfig(): ProjectileShooter {
        return new ProjectileShooter(this, this, {
            selfLayer: PhysicsLayers.ENEMY_PROJECTILE,
            hitLayer: PhysicsLayers.PLAYER,
            projectileSpeed: 2,
            frequency: 1,
            projectiles: 1,
            splashTheme: Theme.PURPLE,
            projectileAnimKeys: SpinnyProjectileAnimationKeys,
            audioName: "enemy_shoot"
        });
    }


}
