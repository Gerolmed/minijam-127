import Container = Phaser.GameObjects.Container;
import {TileTagStore} from "./TileTagStore";
import {IEntityFactory} from "../entities/IEntityFactory";


export type ChunkParams = {

    hasPhysics?: boolean,
    mapContainer: Container,
    tileEnums: TileTagStore,
    entityFactories: IEntityFactory[]
}
