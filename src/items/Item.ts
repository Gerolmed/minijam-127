import {ItemEntity} from "./ItemEntity";
import {Player} from "../entities/living/Player";

export class Item {
    create(itemEntity: ItemEntity) {}
    apply(player: Player): void {}
    getBaseSprite(): string {
        return "item_minor_fish";
    }

    canBeCollected(other: Player) {
        return true;
    }
}
