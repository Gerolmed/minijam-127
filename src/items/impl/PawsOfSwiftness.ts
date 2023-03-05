import {ItemEntity} from "../ItemEntity";
import {Player} from "../../entities/living/Player";
import {Item} from "../Item";
import {RatAnimationKeys} from "../../animations/EnemyAnimationKeys";

export class PawsOfSwiftness extends Item {


    create(itemEntity: ItemEntity) {
    }


    apply(player: Player): void {
       player.addSpeed(player.getBaseSpeed() * .1)
    }


    getBaseSprite(): string {
        return "item_paws_swift"
    }
}
