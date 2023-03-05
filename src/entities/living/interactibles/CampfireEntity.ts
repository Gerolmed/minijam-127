import {InteractableEntity} from "./InteractableEntity";
import {CampfireAnimationKeys} from "../../../animations/ObjectAnimationKeys";
import {Player} from "../Player";
import TimeManager from "../../../TimeManager";
import {HUDScene} from "../../../scenes/HUDScene";

export class CampfireEntity extends InteractableEntity {

    private unlocked: boolean = false; // TODO: load from save
    create() {
        super.create();
        this.animator.load(CampfireAnimationKeys.BASE)
        this.animator.play(CampfireAnimationKeys.UNACTIVATED)
    }

    protected doInteract(player: Player) {
        super.doInteract(player);
        TimeManager.setGameFreeze(true)
        this.unlocked = true;
        this.animator.play(CampfireAnimationKeys.ACTIVATED)
        const hudScene = this.scene.sys.scenePlugin.get<HUDScene>("HUDScene");
        hudScene.doSaveFade(() => this.gameScene.softResetWorld())
            .finally(() => {
                this.showIndicator();
                TimeManager.setGameFreeze(false)
            })
    }
}
