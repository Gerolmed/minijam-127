import {BossEnemy} from "./BossEnemy";
import {EnemyFacing} from "./Enemy";
import {RatKingAnimationKeys} from "../../../animations/EnemyAnimationKeys";
import Vector2 = Phaser.Math.Vector2;

export class RatKing extends BossEnemy {

    create() {
        super.create();

        this.animator.load(RatKingAnimationKeys.BASE);
        this.animator.play(RatKingAnimationKeys.IDLE_DOWN);

        this.setupHealth(200);

        this.physicsOffset = new Vector2(-1,-2);
    }

    getAnimationFrame(facing: EnemyFacing, animation: "WALK" | "IDLE"): string {
        if(facing === EnemyFacing.RIGHT)  {
            return animation === "WALK"? RatKingAnimationKeys.WALK_RIGHT: RatKingAnimationKeys.IDLE_RIGHT;
        } else if(facing === EnemyFacing.LEFT)  {
            return animation === "WALK"? RatKingAnimationKeys.WALK_LEFT: RatKingAnimationKeys.IDLE_LEFT;
        } else if(facing === EnemyFacing.TOP)  {
            return animation === "WALK"? RatKingAnimationKeys.WALK_UP: RatKingAnimationKeys.IDLE_UP;
        } else if(facing === EnemyFacing.DOWN)  {
            return animation === "WALK"? RatKingAnimationKeys.WALK_DOWN: RatKingAnimationKeys.IDLE_DOWN;
        }

        throw new Error("Invalid animation frame")
    }

    async playDeathAnim(): Promise<void> {
        return new Promise(resolve => this.animator.play(Math.random() > .5 ? RatKingAnimationKeys.DEATH_LEFT : RatKingAnimationKeys.DEATH_RIGHT, 0, true, resolve))
    }
}
