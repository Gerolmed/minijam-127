import {ItemEntity} from "../ItemEntity";
import {Player} from "../../entities/living/Player";
import {Item} from "../Item";
export class TripleProjectiles extends Item {

    create(itemEntity: ItemEntity) {
    }


    apply(player: Player): void {

        const shooter = player.getShooter();
        shooter.updateConfig({
            hasSideShots: true
        })
    }


    getBaseSprite(): string {
        return "item_triple_projectile"
    }
}
