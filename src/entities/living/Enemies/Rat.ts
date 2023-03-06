import {Enemy, EnemyFacing} from "./Enemy";
import {RatAnimationKeys, WolfAnimationKeys} from "../../../animations/EnemyAnimationKeys";
import Vector2 = Phaser.Math.Vector2;

export class Rat extends Enemy {


    create() {
        super.create();

        this.animator.load(RatAnimationKeys.BASE);
        this.animator.play(RatAnimationKeys.IDLE_DOWN);

        this.physicsOffset = new Vector2(-1,-2);
    }

    protected safeUpdate(deltaTime: number) {
        super.safeUpdate(deltaTime);
    }

    getAnimationFrame(facing: EnemyFacing, animation: "WALK" | "IDLE"): string {
        if(facing === EnemyFacing.LEFT) {
            return animation === "WALK" ? RatAnimationKeys.WALK_LEFT : RatAnimationKeys.IDLE_LEFT;
        } else if(facing === EnemyFacing.DOWN) {
            return animation === "WALK" ? RatAnimationKeys.WALK_DOWN : RatAnimationKeys.IDLE_DOWN;
        } else if(facing === EnemyFacing.RIGHT) {
            return animation === "WALK" ? RatAnimationKeys.WALK_RIGHT : RatAnimationKeys.IDLE_RIGHT;
        } else if(facing === EnemyFacing.TOP) {
            return animation === "WALK" ? RatAnimationKeys.WALK_UP : RatAnimationKeys.IDLE_UP;
        }

        throw new Error("Invalid animation frame");
    }

}
