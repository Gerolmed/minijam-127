import {ItemEntity} from "../ItemEntity";
import {Player} from "../../entities/living/Player";
import {Item} from "../Item";
import {RatAnimationKeys} from "../../animations/EnemyAnimationKeys";

export class PawsOfGliding extends Item {

    create(itemEntity: ItemEntity) {
    }


    apply(player: Player): void {

        player.addSpeed(player.getBaseSpeed() * .2)
        const shooter = player.getShooter();
        shooter.updateConfig({
            frequency: shooter.getConfig().frequency - shooter.getBaseConfig().frequency * 0.1,
        })
    }


    getBaseSprite(): string {
        return "item_paws_glide"
    }
}
