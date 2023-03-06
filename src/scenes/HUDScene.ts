import {Scene} from "phaser";
import GameScene from "./Game";
import {Player} from "../entities/living/Player";
import {PlayerHealthBar} from "../ui/PlayerHealthBar";
import {SaveScreen} from "../ui/SaveScreen";
import {DeathScreen} from "../ui/DeathScreen";
import {VictoryScreen} from "../ui/VictoryScreen";
import {PlayerMiniMap} from "../ui/PlayerMiniMap";

export class HUDScene extends Scene {
    private gameScene!: GameScene;
    private started = false;
    private saveScreen!: SaveScreen;
    private deathScreen!:DeathScreen;
    private victoryScreen!: VictoryScreen;
    private healthbar?: PlayerHealthBar;
    private miniMap?: PlayerMiniMap;


    constructor() {
        super({
            key: "HUDScene"
        });
    }

    preload() {
        this.load.image("minimap", "assets/map/Map.png")
        this.load.image("minimap_marker", "assets/map/marker.png")
        this.load.image("hp_bar_text", "assets/Sprites/UI/HealthHP.png")
        this.load.image("hp_bar_frame", "assets/Sprites/UI/HPBar_Frame.png")
        this.load.image("hp_bar_fill", "assets/Sprites/UI/HPBar_Fill.png")
        this.load.audio("game_over", "assets/audio/music/DeathJingle.mp3")
        this.load.audio("victory", "assets/audio/music/VictorySound.mp3")
    }

    create() {
        this.started = false;

        this.saveScreen = new SaveScreen(this);
        this.deathScreen = new DeathScreen(this);
        this.victoryScreen = new VictoryScreen(this);
        this.gameScene = this.scene.get("GameScene") as GameScene;
    }

    doLateCreate() {

        const camera = this.cameras.main;

        // camera.zoom = Constants.UPSCALE_FACTOR;

        // Black Magic value I hate math
        // camera.setScroll(-480, -270);

        this.refresh()
    }

    update(time: number, delta: number) {
        super.update(time, delta);

        this.miniMap?.update();

        if(!this.started) {
            if(this.gameScene.isReady()) {
                this.started = true;
                this.doLateCreate();
            }
        }
    }

    doSaveFade(doSave: () => Promise<void>): Promise<void> {
        return this.saveScreen.doSaveFade(doSave);
    }

    removeDeath() {
        this.deathScreen.remove();
    }

    async doDeathAnimation(): Promise<void> {
        return this.deathScreen.doDeathFade();
    }
    async doVictoryAnimation(): Promise<void> {
        return this.victoryScreen.doFade();
    }

    refresh() {
        const player = this.gameScene.getEntityByName<Player>("Player")!;
        this.healthbar?.remove();
        this.healthbar = new PlayerHealthBar(this, player)
        this.miniMap?.remove();
        this.miniMap = new PlayerMiniMap(this, player)
    }
}
