import Phaser from 'phaser';
import {Tilemap} from "../types/Tilemap";
import {ChunkedTilemap} from "../tilemap/ChunkedTilemap";
import {Player} from "../entities/living/Player";
import {Entity} from "../entities/Entity";
import {LivingEntity} from "../entities/living/LivingEntity";
import {OverworldAreaFactory} from "../world/OverworldAreaFactory";
import FilterMode = Phaser.Textures.FilterMode;

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

    private addEntity<T extends Entity>(entity: T): T {
        entity.create();
        this.add.existing(entity);
        return entity;
    }

    create() {
        this.textures.get("tileset").setFilter(FilterMode.NEAREST);

        const map: Tilemap = this.cache.json.get("map");
        const tilemap = new ChunkedTilemap(map, new OverworldAreaFactory(), this);
        const areas = tilemap.getAreas();
        tilemap.enter(this, areas[0]);

        const player = this.addEntity(new Player(this, 300, 100))
        this.addEntity(new LivingEntity(this, 200, 100))

        this.cameras.main.startFollow(player, false, .09, .09);
    }
}
