import {ItemEntity} from "../ItemEntity";
import {Player} from "../../entities/living/Player";
import {Item} from "../Item";
import {RatAnimationKeys} from "../../animations/EnemyAnimationKeys";

export class SuperCatfoodCan extends Item {

    constructor(
        id: string) {
        super(id);
    }

    create(itemEntity: ItemEntity) {
    }

    apply(player: Player): void {
        player.addMaxHealth(10);
    }

    getBaseSprite(): string {
        return "item_catfood"
    }
}
