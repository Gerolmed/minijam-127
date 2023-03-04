import Phaser from 'phaser';
import {Tilemap} from "../types/Tilemap";
import {ChunkedTilemap} from "../tilemap/ChunkedTilemap";
import {Player} from "../entities/living/Player";
import {Entity} from "../entities/Entity";
import {OverworldAreaFactory} from "../world/OverworldAreaFactory";
import {Jukebox} from "../audio/JukeBox";
import FilterMode = Phaser.Textures.FilterMode;
import SpriteLoader from "../animations/SpriteLoader";
import MatterCollisionPlugin from "phaser-matter-collision-plugin";
import {Wolf} from "../entities/living/Enemies/Wolf";
import {PhysicsSocket} from "../entities/living/PhysicsSocket";
import Container = Phaser.GameObjects.Container;


export default class GameScene extends Phaser.Scene {

    private readonly jukebox!: Jukebox;

    private entityContainer!: Container;

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

        SpriteLoader(this.load)

        this.load.image("logo", 'assets/phaser3-logo.png');
        this.load.json("map", "assets/map/map.ldtk")
        this.load.spritesheet("tileset", "assets/tilesets/tileset.png", {
            frameWidth: 16,
            frameHeight: 16,
            spacing: 0,
            margin: 0
        })

        this.load.spritesheet("tileset_orange", "assets/tilesets/tileset_overworld_orange.png", {
            frameWidth: 16,
            frameHeight: 16,
            spacing: 1,
            margin: 0
        })
    }

    public addEntity<T extends Entity>(entity: T): T {
        entity.create();
        this.entityContainer.add(entity);
        this.sys.updateList.add(entity);
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


        // Init Entities
        //////////////////
        this.entityContainer = this.add.container();

        const player = this.addEntity(new Player(this, 300, 100))

        const physicsSocket = new PhysicsSocket();
        physicsSocket.setPlayer(player);
        physicsSocket.setTilemap(tilemap);


        this.addEntity(new Wolf(this, 200, 150, physicsSocket))

        this.cameras.main.zoom = 4;
        this.cameras.main.startFollow(player, false, .09, .09);


        // Unlocks audio after first click
        this.sound.unlock();
    }

    update(time: number, delta: number) {
        this.jukebox.update(delta/1000)
    }

    get matterCollisionPlugin() {
        return this.matterCollision as MatterCollisionPlugin
    }
}
