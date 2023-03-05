import {ItemEntity} from "./ItemEntity";
import {Player} from "../entities/living/Player";
import {Item} from "./Item";
import {RatAnimationKeys} from "../animations/EnemyAnimationKeys";

export class MaxHealthItem extends Item {

    constructor(private maxHealth: number) {
        super();
    }

    create(itemEntity: ItemEntity) {
    }

    apply(player: Player): void {
        player.addMaxHealth(this.maxHealth);
    }

    getBaseSprite(): string {
        return "item_greater_fish"
    }
}
