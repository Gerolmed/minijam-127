import {BossEnemy} from "./BossEnemy";
import {AlphaAnimationKeys, RatKingAnimationKeys} from "../../../animations/EnemyAnimationKeys";
import {EnemyFacing} from "./Enemy";
import Vector2 = Phaser.Math.Vector2;

export class Alpha extends BossEnemy {

    create() {
        super.create();

        this.animator.load(AlphaAnimationKeys.BASE);
        this.animator.play(AlphaAnimationKeys.IDLE_DOWN);

        this.setupHealth(200);

        this.physicsOffset = new Vector2(-1,-2);
    }

    getAnimationFrame(facing: EnemyFacing, animation: "WALK" | "IDLE"): string {
        if(facing === EnemyFacing.RIGHT)  {
            return animation === "WALK"? AlphaAnimationKeys.WALK_RIGHT: AlphaAnimationKeys.IDLE_RIGHT;
        } else if(facing === EnemyFacing.LEFT)  {
            return animation === "WALK"? AlphaAnimationKeys.WALK_LEFT: AlphaAnimationKeys.IDLE_LEFT;
        } else if(facing === EnemyFacing.TOP)  {
            return animation === "WALK"? AlphaAnimationKeys.WALK_UP: AlphaAnimationKeys.IDLE_UP;
        } else if(facing === EnemyFacing.DOWN)  {
            return animation === "WALK"? AlphaAnimationKeys.WALK_DOWN: AlphaAnimationKeys.IDLE_DOWN;
        }

        throw new Error("Invalid animation frame")
    }

}
