import {ItemEntity} from "../ItemEntity";
import {Player} from "../../entities/living/Player";
import {Item} from "../Item";
export class SlingTail extends Item {

    create(itemEntity: ItemEntity) {
    }


    apply(player: Player): void {

        const shooter = player.getShooter();
        shooter.updateConfig({
            hasBackShot: true
        })
    }


    getBaseSprite(): string {
        return "item_sling_tail"
    }
}
