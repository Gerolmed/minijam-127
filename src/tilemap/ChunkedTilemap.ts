import {Tilemap} from "../types/Tilemap";
import {layerToIntGrid} from "./Layer";
import {Scene} from "phaser";
import Sprite = Phaser.GameObjects.Sprite;

export class ChunkedTilemap {

    constructor(private map: Tilemap) {
    }

    draw(scene: Scene) {
        this.map.levels.forEach(level => {
            const gridSize = level.layerInstances[0].__gridSize;

            level.layerInstances.forEach(layer => {
                const grid = layerToIntGrid(layer);

                for(let x = 0; x < layer.__cWid; x++) {
                    for(let y = 0; y < layer.__cHei; y++) {
                        scene.add.sprite(x * layer.__gridSize + level.worldX, y * layer.__gridSize + level.worldY, "tileset", grid[x][y]);
                    }
                }
            })
        })
    }

}