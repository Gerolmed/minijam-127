import {ItemEntity} from "../ItemEntity";
import {Player} from "../../entities/living/Player";
import {Item} from "../Item";

export class MinorFish extends Item {



    create(itemEntity: ItemEntity) {
    }


    canBeCollected(other: Player): boolean {
        return other.getHealth() < other.getMaxHealth();
    }

    apply(player: Player): void {
        player.heal(player.getMaxHealth() * 0.1);
    }

    getBaseSprite(): string {
        return "item_minor_fish"
    }

    isPersistent(): boolean {
        return false;
    }
}
