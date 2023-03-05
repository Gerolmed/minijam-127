import {ItemEntity} from "../ItemEntity";
import {Player} from "../../entities/living/Player";
import {Item} from "../Item";
import {
    LargePlayerProjectileAnimationKeys, SplatsLarge, SplatsSmall,
} from "../../animations/ProjectileAnimationKeys";

export class SpecialConcoction extends Item {

    create(itemEntity: ItemEntity) {
    }


    apply(player: Player): void {

        const shooter = player.getShooter();
        shooter.updateConfig({
            splatsPath: SplatsLarge
        })
    }


    getBaseSprite(): string {
        return "item_special_concoction"
    }
}
