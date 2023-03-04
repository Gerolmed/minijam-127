import {Player} from "./Player";
import {ChunkedTilemap} from "../../tilemap/ChunkedTilemap";

export class PhysicsSocket {

    private player?: Player;
    private tilemap?: ChunkedTilemap;

    setPlayer(player: Player) {
        this.player = player;
    }

    setTilemap(tilemap: ChunkedTilemap) {
        this.tilemap = tilemap;
    }

    getPlayer() {
        return this.player;
    }

    getTileBodies(): MatterJS.BodyType[] {
        if(!(this.tilemap))
            return [];

        return this.tilemap.getPhysicsBodies();
    }

}
