import {ItemEntity} from "../ItemEntity";
import {Player} from "../../entities/living/Player";
import {Item} from "../Item";

export class GreaterFish extends Item {


    create(itemEntity: ItemEntity) {
    }


    canBeCollected(other: Player): boolean {
        return other.getHealth() < other.getMaxHealth();
    }

    apply(player: Player): void {
        player.heal(player.getMaxHealth());
    }

    getBaseSprite(): string {
        return "item_greater_fish"
    }

    isPersistent(): boolean {
        return false;
    }
}
