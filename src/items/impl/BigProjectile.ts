import {ItemEntity} from "../ItemEntity";
import {Player} from "../../entities/living/Player";
import {Item} from "../Item";
import {LargePlayerProjectileAnimationKeys} from "../../animations/ProjectileAnimationKeys";

export class BigProjectile extends Item {

    create(itemEntity: ItemEntity) {
    }


    apply(player: Player): void {

        const shooter = player.getShooter();
        shooter.updateConfig({
            projectileAnimKeys: LargePlayerProjectileAnimationKeys,
            hitBoxSizeMod: 1.5,
            accuracy: shooter.getConfig().accuracy+0.05,
        })
    }


    getBaseSprite(): string {
        return "item_bigger_projectile"
    }
}
