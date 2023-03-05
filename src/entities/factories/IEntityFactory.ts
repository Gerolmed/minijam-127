import {EntityInstance, Layer} from "../../types/Tilemap";
import {Entity} from "../Entity";
import {Scene} from "phaser";

export interface IEntityFactory {

    supports(typeID: number): boolean;

    produce(instance: EntityInstance, layer: Layer, chunkX: number, chunkY: number, scene: Scene): Entity;

}
