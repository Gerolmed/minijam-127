import {InteractableEntity} from "./InteractableEntity";
import {Player} from "../Player";
import {DialogBox} from "../../../ui/DialogBox";
import TimeManager from "../../../TimeManager";

export class NPCEntity extends InteractableEntity {

    death() {
        // DO NOTHING
    }

    protected doInteract(player: Player) {
        super.doInteract(player);
        TimeManager.setGameFreeze(true);
        player.forceIdle();
        const box = this.scene.add.existing(new DialogBox(this.scene, this.x, this.y-12, "Hello 'cat yourname.txt'? \nHave Fun!"))
        box.start().finally(() => {
            TimeManager.setGameFreeze(false)
            this.showIndicator()
        });
    }
}
