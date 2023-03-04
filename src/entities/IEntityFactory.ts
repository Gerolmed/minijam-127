import {EntityInstance} from "../types/Tilemap";
import {Entity} from "./Entity";
import {Scene} from "phaser";

export interface IEntityFactory {

    supports(typeID: number): boolean;

    produce(instance: EntityInstance, scene: Scene): Entity;

}
