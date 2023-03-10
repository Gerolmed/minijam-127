import {Enemy, EnemyFacing} from "./Enemy";
import {OpossumAnimationKeys} from "../../../animations/EnemyAnimationKeys";
import Vector2 = Phaser.Math.Vector2;

export class Opossum extends Enemy {


    create() {
        super.create();

        this.animator.load(OpossumAnimationKeys.BASE);
        this.animator.play(OpossumAnimationKeys.IDLE_DOWN);

        this.physicsOffset = new Vector2(-1,-2);
    }

    protected safeUpdate(deltaTime: number) {
        super.safeUpdate(deltaTime);
    }

    getAnimationFrame(facing: EnemyFacing, animation: "WALK" | "IDLE"): string {
        if(facing === EnemyFacing.LEFT) {
            return animation === "WALK" ? OpossumAnimationKeys.WALK_LEFT : OpossumAnimationKeys.IDLE_LEFT;
        } else if(facing === EnemyFacing.DOWN) {
            return animation === "WALK" ? OpossumAnimationKeys.WALK_DOWN : OpossumAnimationKeys.IDLE_DOWN;
        } else if(facing === EnemyFacing.RIGHT) {
            return animation === "WALK" ? OpossumAnimationKeys.WALK_RIGHT : OpossumAnimationKeys.IDLE_RIGHT;
        } else if(facing === EnemyFacing.TOP) {
            return animation === "WALK" ? OpossumAnimationKeys.WALK_UP : OpossumAnimationKeys.IDLE_UP;
        }

        throw new Error("Invalid animation frame");
    }



    async playDeathAnim(): Promise<void> {
        return new Promise(resolve => this.animator.play(Math.random() > .5 ? OpossumAnimationKeys.DEATH_LEFT : OpossumAnimationKeys.DEATH_RIGHT, 2, true, resolve))
    }

}
