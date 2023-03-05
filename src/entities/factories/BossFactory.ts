import {IEntityFactory} from "./IEntityFactory";
import {EntityInstance, Layer} from "../../types/Tilemap";
import {Entity} from "../Entity";

export class BossFactory implements IEntityFactory {

    supports(typeID: number): boolean {
        return false;
    }

    produce(instance: EntityInstance, layer: Layer, chunkX: number, chunkY: number, scene: Phaser.Scene): Entity {
        throw new Error("Not implemented");
    }

}
