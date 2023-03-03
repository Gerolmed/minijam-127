import Phaser from 'phaser';
import {Tilemap} from "../types/Tilemap";
import {layerToIntGrid} from "../tilemap/Layer";
import Sprite = Phaser.GameObjects.Sprite;
import {ChunkedTilemap} from "../tilemap/ChunkedTilemap";
import {OverworldAreaFactory} from "../world/OverworldAreaFactory";

export default class Demo extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  preload() {
    this.load.image("logo", 'assets/phaser3-logo.png');
    this.load.json("map", "assets/map/map.ldtk")
    this.load.spritesheet("tileset", "assets/tilesets/tileset_overworld.png", {
      frameWidth: 16,
      frameHeight: 16,
      spacing: 1,
      margin: 0
    })
  }

  create() {
    const map: Tilemap = this.cache.json.get("map");
    const tilemap = new ChunkedTilemap(map, new OverworldAreaFactory());
    const areas = tilemap.getAreas();
    tilemap.enter(this, areas[0]);
  }
}
