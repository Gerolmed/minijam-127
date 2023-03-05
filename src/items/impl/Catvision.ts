import {ItemEntity} from "../ItemEntity";
import {Player} from "../../entities/living/Player";
import {Item} from "../Item";
import {SmallPlayerProjectileAnimationKeys} from "../../animations/ProjectileAnimationKeys";

export class Catvision extends Item {

    create(itemEntity: ItemEntity) {
    }


    apply(player: Player): void {

        const shooter = player.getShooter();
        shooter.updateConfig({
            projectileAnimKeys: SmallPlayerProjectileAnimationKeys,
            hitBoxSizeMod: .75,
            accuracy: shooter.getConfig().accuracy-.1,
            range: 1.5
        })
    }


    getBaseSprite(): string {
        return "item_catvision"
    }
}
