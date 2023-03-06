import {Scene} from "phaser";
import Constants from "../Constants";
import GameScene from "./Game";
import {Player} from "../entities/living/Player";
import {PlayerHealthBar} from "../ui/PlayerHealthBar";
import {SaveScreen} from "../ui/SaveScreen";

export class HUDScene extends Scene {
    private gameScene!: GameScene;
    private started = false;
    private saveScreen = new SaveScreen(this);


    constructor() {
        super({
            key: "HUDScene"
        });
    }

    preload() {
        this.load.image("hp_bar_text", "assets/Sprites/UI/HealthHP.png")
        this.load.image("hp_bar_frame", "assets/Sprites/UI/HPBar_Frame.png")
        this.load.image("hp_bar_fill", "assets/Sprites/UI/HPBar_Fill.png")
    }

    create() {
        this.gameScene = this.scene.get("GameScene") as GameScene;
    }

    doLateCreate() {

        const camera = this.cameras.main;

        camera.zoom = Constants.UPSCALE_FACTOR;

        // Black Magic value I hate math
        camera.setScroll(-480, -270);

        const player = this.gameScene.getEntityByName<Player>("Player")!;

        new PlayerHealthBar(this, player)
    }

    update(time: number, delta: number) {
        super.update(time, delta);

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

    async DoDeathAnimation(): Promise<void> {
        // return this.deathScreen.doSaveFade(doSave);

    }
}
