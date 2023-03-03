import Phaser from 'phaser';
import {Tilemap} from "../types/Tilemap";
import {ChunkedTilemap} from "../tilemap/ChunkedTilemap";
import {Player} from "../entities/living/Player";
import {Entity} from "../entities/Entity";
import {LivingEntity} from "../entities/living/LivingEntity";
import {OverworldAreaFactory} from "../world/OverworldAreaFactory";
import {Jukebox} from "../audio/JukeBox";

export default class Demo extends Phaser.Scene {

    private readonly jukebox = new Jukebox();

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

        this.jukebox.load(this);
    }

    private addEntity<T extends Entity>(entity: T): T {
        entity.create();
        this.add.existing(entity);
        return entity;
    }

    create() {
        const mapContainer = this.add.container(0, 0,);
        const map: Tilemap = this.cache.json.get("map");
        const tilemap = new ChunkedTilemap(map, mapContainer, new OverworldAreaFactory());
        const areas = tilemap.getAreas();
        tilemap.enter(this, areas[0]);

        const player = this.addEntity(new Player(this, 300, 100))
        this.addEntity(new LivingEntity(this, 200, 100))

        this.cameras.main.startFollow(player, false, .09, .09);


        // Unlocks audio after first click
        this.sound.unlock();

    }

    update(time: number, delta: number) {
        this.jukebox.update(delta/1000)
    }
}
