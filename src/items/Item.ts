import {ItemEntity} from "./ItemEntity";
import {Player} from "../entities/living/Player";

export class Item {

    constructor(
        public readonly ID: string
    ) {
    }
    create(itemEntity: ItemEntity) {}
    apply(player: Player): void {}
    getBaseSprite(): string {
        return "item_minor_fish";
    }

    canBeCollected(other: Player) {
        return true;
    }

    isPersistent(): boolean {
        return true;
    }
}
