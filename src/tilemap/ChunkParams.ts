import Container = Phaser.GameObjects.Container;
import {TileTagStore} from "./TileTagStore";

export type ChunkParams = {

    hasPhysics?: boolean,
    mapContainer: Container;
    tileEnums: TileTagStore;
}
