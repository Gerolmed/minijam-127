import {Player} from "../../entities/living/Player";
import {Item} from "../Item";

export class TripleProjectiles extends Item {

    apply(player: Player): void {

        const shooter = player.getShooter();
        shooter.updateConfig({
            hasSideShots: true,
            accuracy: shooter.getConfig().accuracy+0.2,
        })
    }


    getBaseSprite(): string {
        return "item_triple_projectile"
    }
}
