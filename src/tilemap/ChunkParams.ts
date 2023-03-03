import Container = Phaser.GameObjects.Container;
import {TileTagStore} from "./TileTagStore";
import {Color} from "../painting/Color";

export type ChunkParams = {

    hasPhysics?: boolean,
    colorContainer: Map<Color, Container>,
    tileEnums: TileTagStore;
}
