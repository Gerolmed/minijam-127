import {BossEnemy} from "./BossEnemy";
import {AlphaAnimationKeys} from "../../../animations/EnemyAnimationKeys";
import {EnemyFacing} from "./Enemy";
import TimeManager from "../../../TimeManager";
import {HUDScene} from "../../../scenes/HUDScene";
import Vector2 = Phaser.Math.Vector2;
import {WorldStoreManager} from "../../../world/WorldSave";

export class Alpha extends BossEnemy {

    create() {
        super.create();

        this.animator.load(AlphaAnimationKeys.BASE);
        this.animator.play(AlphaAnimationKeys.IDLE_DOWN);

        this.setupHealth(600);

        this.physicsOffset = new Vector2(-1,-2);
    }

    protected safeDeath() {
        this.gameScene.getJukebox().setTheme("overworld");
        super.safeDeath();

        WorldStoreManager.get().getStore().alphaKilled = true;
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

    death() {
        super.death();
        TimeManager.setGameFreeze(true)
        this.gameScene.sys.scenePlugin.get<HUDScene>("HUDScene").doVictoryAnimation().then(() => {});
    }


    async playDeathAnim(): Promise<void> {
        return new Promise(resolve => this.animator.play(AlphaAnimationKeys.DEATH, 0, true, resolve))
    }
}
