import {InteractableEntity} from "./InteractableEntity";
import {CampfireAnimationKeys} from "../../../animations/ObjectAnimationKeys";
import {Player} from "../Player";
import TimeManager from "../../../TimeManager";
import {HUDScene} from "../../../scenes/HUDScene";
import {WorldStoreManager} from "../../../world/WorldSave";
import GameScene from "../../../scenes/Game";
import {PhysicsSocket} from "../PhysicsSocket";

export class CampfireEntity extends InteractableEntity {

    private unlocked: boolean = false; // TODO: load from save

    constructor(scene: GameScene, x: number, y: number, physicsSocket: PhysicsSocket, private readonly entityId: string) {
        super(scene, x, y, physicsSocket);
        this.unlocked = !!WorldStoreManager.get().getStore().raw["campfire_unlock_"+entityId]
    }

    create() {
        super.create();
        this.setDepth(-10)
        this.animator.load(CampfireAnimationKeys.BASE)
        this.animator.play(this.unlocked ? CampfireAnimationKeys.ACTIVATED : CampfireAnimationKeys.UNACTIVATED)

    }

    protected doInteract(player: Player) {
        super.doInteract(player);
        TimeManager.setGameFreeze(true)
        player.forceIdle()
        player.heal(player.getMaxHealth())
        this.unlocked = true;
        this.animator.play(CampfireAnimationKeys.ACTIVATED)
        const hudScene = this.scene.sys.scenePlugin.get<HUDScene>("HUDScene");
        WorldStoreManager.get().getStore().raw["campfire_unlock_"+this.entityId] = true
        WorldStoreManager.get().getStore().spawnPosition = {x: this.x, y: this.y + 15};

        hudScene.doSaveFade(() => this.gameScene.softResetWorld())
            .finally(() => {
                TimeManager.setGameFreeze(false)
            })
    }

    protected getActionText(): string {
        return "to save";
    }
}
