import {ItemEntity} from "../ItemEntity";
import {Player} from "../../entities/living/Player";
import {Item} from "../Item";
import {SplatsLarge,} from "../../animations/ProjectileAnimationKeys";

export class SpecialConcoction extends Item {

    create(itemEntity: ItemEntity) {
    }


    apply(player: Player): void {

        const shooter = player.getShooter();
        shooter.updateConfig({
            splatsPath: SplatsLarge,
            accuracy: shooter.getConfig().accuracy+.05,
        })
    }


    getBaseSprite(): string {
        return "item_special_concoction"
    }
}
