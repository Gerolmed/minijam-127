import {BossEnemy} from "./BossEnemy";
import {
    AlphaAnimationKeys,
    OpossumAnimationKeys,
    OpportunisticOpossumAnimationKeys
} from "../../../animations/EnemyAnimationKeys";
import {EnemyFacing} from "./Enemy";
import Vector2 = Phaser.Math.Vector2;
import {WorldStoreManager} from "../../../world/WorldSave";

export class OpportunisticOpossum extends BossEnemy {

    create() {
        super.create();

        this.animator.load(OpportunisticOpossumAnimationKeys.BASE);
        this.animator.play(OpportunisticOpossumAnimationKeys.IDLE_DOWN);

        this.setupHealth(200);

        this.physicsOffset = new Vector2(-1,-2);
    }


    protected safeDeath() {
        this.gameScene.getJukebox().setTheme("overworld");
        super.safeDeath();

        WorldStoreManager.get().getStore().ratKingKilled = true;
    }

    getAnimationFrame(facing: EnemyFacing, animation: "WALK" | "IDLE"): string {
        if(facing === EnemyFacing.RIGHT)  {
            return animation === "WALK"? OpportunisticOpossumAnimationKeys.WALK_RIGHT: OpportunisticOpossumAnimationKeys.IDLE_RIGHT;
        } else if(facing === EnemyFacing.LEFT)  {
            return animation === "WALK"? OpportunisticOpossumAnimationKeys.WALK_LEFT: OpportunisticOpossumAnimationKeys.IDLE_LEFT;
        } else if(facing === EnemyFacing.TOP)  {
            return animation === "WALK"? OpportunisticOpossumAnimationKeys.WALK_UP: OpportunisticOpossumAnimationKeys.IDLE_UP;
        } else if(facing === EnemyFacing.DOWN)  {
            return animation === "WALK"? OpportunisticOpossumAnimationKeys.WALK_DOWN: OpportunisticOpossumAnimationKeys.IDLE_DOWN;
        }

        throw new Error("Invalid animation frame")
    }

}
