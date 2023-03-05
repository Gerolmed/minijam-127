import Phaser from 'phaser';
import {Tilemap} from "../types/Tilemap";
import {ChunkedTilemap} from "../tilemap/ChunkedTilemap";
import {Player} from "../entities/living/Player";
import {Entity} from "../entities/Entity";
import {OverworldAreaFactory} from "../world/OverworldAreaFactory";
import {Jukebox} from "../audio/JukeBox";
import SpriteLoader from "../animations/SpriteLoader";
import MatterCollisionPlugin from "phaser-matter-collision-plugin";
import {PhysicsSocket} from "../entities/living/PhysicsSocket";
import Constants from "../Constants";
import {EnemyFactory} from "../entities/factories/EnemyFactory";
import {ItemEntity} from "../items/ItemEntity";
import {MaxHealthItem} from "../items/MaxHealthItem";
import {Theme} from "../painting/Theme";
import FilterMode = Phaser.Textures.FilterMode;
import Container = Phaser.GameObjects.Container;


export default class GameScene extends Phaser.Scene {

    private readonly jukebox!: Jukebox;

    private entityContainer!: Container;
    private ready = false;
    private tilemap!: ChunkedTilemap;

    constructor() {
        super({
            key: "GameScene"
        });
        this.jukebox = new Jukebox(this, {
            defaultTheme: "overworld",
            themes: {
                overworld: [
                    {
                        paths: [
                            "assets/audio/music/overworld/PreVersion.mp3",
                        ]
                    },
                ]
            }
        });
    }

    preload() {
        this.jukebox.load();

        SpriteLoader(this.load)

        this.load.image("logo", "assets/phaser3-logo.png");
        this.load.json("map", "assets/map/map.ldtk")
        this.load.spritesheet("tileset", "assets/tilesets/tileset.png", {
            frameWidth: 16,
            frameHeight: 16,
            spacing: 0,
            margin: 0
        })

        this.load.spritesheet("tileset_orange", "assets/tilesets/tilesetOrange.png", {
            frameWidth: 16,
            frameHeight: 16,
            spacing: 0,
            margin: 0
        })
        this.load.spritesheet("tileset_purple", "assets/tilesets/tilesetPurple.png", {
            frameWidth: 16,
            frameHeight: 16,
            spacing: 0,
            margin: 0
        })
    }

    public addEntity<T extends Entity> (entity: T): T {
        entity.create();
        this.entityContainer.add(entity);
        this.sys.updateList.add(entity);
        return entity;
    }

    create() {
        this.jukebox.start();

        this.textures.get("tileset").setFilter(FilterMode.NEAREST);
        this.textures.get("tileset_orange").setFilter(FilterMode.NEAREST);
        this.textures.get("tileset_purple").setFilter(FilterMode.NEAREST);

        const map: Tilemap = this.cache.json.get("map");
        this.tilemap = new ChunkedTilemap(map, new OverworldAreaFactory(), this);
        const areas = this.tilemap.getAreas();

        const physicsSocket = new PhysicsSocket();
        const enemyFactory = new EnemyFactory(this, physicsSocket, (entity) => this.addEntity(entity));
        this.tilemap.registerEntityFactory(enemyFactory);

        this.entityContainer = this.add.container();

        this.tilemap.enter(areas[0]);


        // Init Entities
        /////////////////

        const player = this.addEntity(new Player(this, 300, 100))
        this.addEntity(new ItemEntity(this, 300, 140, new MaxHealthItem(10)))
        player.setTilemap(this.tilemap);

        physicsSocket.setPlayer(player);
        physicsSocket.setTilemap(this.tilemap);


        // this.addEntity(new Wolf(this, physicsSocket, new Vector2(200, 150)));

        this.cameras.main.zoom = Constants.UPSCALE_FACTOR;
        this.cameras.main.startFollow(player, false, .09, .09);


        // Unlocks audio after first click
        this.sound.unlock();

        this.ready = true;

        this.events.on('shutdown', () => this.jukebox.kill())

        setInterval(() => {
            this.tilemap.paint(player, Theme.PURPLE);
        }, 3 * 1000)

    }

    public isReady() {
        return this.ready;
    }

    update(time: number, delta: number) {
        this.jukebox.update(delta/1000)
    }

    getEntityByName<T extends Entity>(name: string): T | undefined {
        return this.entityContainer.getByName(name) as T;
    }


    get matterCollisionPlugin() {
        return this.matterCollision as MatterCollisionPlugin
    }

    getTilemap() {
        return this.tilemap
    }
}
