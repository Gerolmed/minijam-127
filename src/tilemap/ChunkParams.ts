import Container = Phaser.GameObjects.Container;
import {TileTagStore} from "./TileTagStore";

export type ChunkParams = {
    mapContainer: Container;
    tileEnums: TileTagStore;
}
