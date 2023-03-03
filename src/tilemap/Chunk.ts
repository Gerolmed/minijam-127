import {Area} from "../world/Area";
import {Scene} from "phaser";
import {Level} from "../types/Tilemap";
import {layerToIntGrid} from "./Layer";
import Sprite = Phaser.GameObjects.Sprite;

export class Chunk {

    constructor(private readonly area: Area, private readonly level: Level) {

    }

    getArea(): Area {
        return this.area;
    }

    render(scene: Scene) {
        const container = scene.add.container(0, 0);
        this.level.layerInstances.forEach(layer => {
            const grid = layerToIntGrid(layer);

            for(let x = 0; x < layer.__cWid; x++) {
                for(let y = 0; y < layer.__cHei; y++) {
                    const index = grid[x][y];
                    if(index == 0) continue;
                    const sprite = scene.add.sprite(x * layer.__gridSize + this.level.worldX, y * layer.__gridSize + this.level.worldY, "tileset", index)
                    container.add(sprite);
                }
            }
        })
    }

    unload(scene: Scene) {

    }

}
