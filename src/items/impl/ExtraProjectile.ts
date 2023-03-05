import {ItemEntity} from "../ItemEntity";
import {Player} from "../../entities/living/Player";
import {Item} from "../Item";
import {RatAnimationKeys} from "../../animations/EnemyAnimationKeys";

export class ExtraProjectile extends Item {


    create(itemEntity: ItemEntity) {
    }


    apply(player: Player): void {
        const shooter = player.getShooter();
        shooter.updateConfig({
            projectiles: shooter.getConfig().projectiles +1,
        })
    }


    getBaseSprite(): string {
        return "item_extra_projectile"
    }
}
