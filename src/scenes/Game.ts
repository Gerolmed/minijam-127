import Phaser from 'phaser';
import {Tilemap} from "../types/Tilemap";
import {ChunkedTilemap} from "../tilemap/ChunkedTilemap";
import {Player} from "../entities/living/Player";
import {Entity} from "../entities/Entity";
import {LivingEntity} from "../entities/living/LivingEntity";
import {OverworldAreaFactory} from "../world/OverworldAreaFactory";
import {Jukebox} from "../audio/JukeBox";
import {Theme} from "../painting/Theme";
import FilterMode = Phaser.Textures.FilterMode;
import {PersistenceManager} from "../persistence/PersistenceManager";
import SpriteLoader from "../animations/SpriteLoader";


export default class Demo extends Phaser.Scene {

    private readonly jukebox!: Jukebox;

    constructor() {
        super('GameScene');
        this.jukebox = new Jukebox(this, {
            defaultTheme: "test",
            themes: {
                test: [
                    {
                        paths: [
                            "assets/audio/music/test/test.mp3",
                        ]
                    },
                    {
                        paths: [
                            "assets/audio/music/test/test2.mp3",
                        ]
                    },
                ]
            }
        });
    }

    preload() {
        this.jukebox.load();

        this.load.image("logo", 'assets/phaser3-logo.png');
        this.load.json("map", "assets/map/map.ldtk")
        this.load.spritesheet("tileset", "assets/tilesets/tileset_overworld.png", {
            frameWidth: 16,
            frameHeight: 16,
            spacing: 1,
            margin: 0
        })

        this.load.spritesheet("tileset_orange", "assets/tilesets/tileset_overworld_orange.png", {
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
        this.jukebox.start();

        this.textures.get("tileset").setFilter(FilterMode.NEAREST);
        this.textures.get("tileset_orange").setFilter(FilterMode.NEAREST);

        const map: Tilemap = this.cache.json.get("map");
        const tilemap = new ChunkedTilemap(map, new OverworldAreaFactory(), this);
        const areas = tilemap.getAreas();
        tilemap.enter(this, areas[0]);

        const player = this.addEntity(new Player(this, 300, 100))
        this.addEntity(new LivingEntity(this, 200, 100))

        this.cameras.main.zoom = 4;

        this.cameras.main.startFollow(player, false, .09, .09);


        // Unlocks audio after first click
        this.sound.unlock();


        // TODO: remove
        setInterval(() => {
            tilemap.paint(player, Theme.ORANGE);
        }, 5 * 1000)
    }

    update(time: number, delta: number) {
        this.jukebox.update(delta/1000)
    }
}
