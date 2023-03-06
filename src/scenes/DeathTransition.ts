import {Scene} from "phaser";
import Constants from "../Constants";
import GameScene from "./Game";
import {DeathScreen} from "../ui/DeathScreen";

export class DeathTransition extends Scene {
    private started = false;
    private deathScreen = new DeathScreen(this);


    constructor() {
        super({
            key: "DeathTransition"
        });
    }

    create() {
        const camera = this.cameras.main;

        camera.zoom = Constants.UPSCALE_FACTOR;

        // Black Magic value I hate math
        camera.setScroll(-480, -270);

    }

    doLateCreate() {
        this.sys.scenePlugin.launch("HUDScene")
        this.sys.scenePlugin.launch("GameScene")
        this.deathScreen.doDeathFadeAway().then(() => this.sys.scenePlugin.stop("DeathTransition"))
    }

    update(time: number, delta: number) {

        if(this.started) return
        this.started = true;
        this.doLateCreate()
    }

}
