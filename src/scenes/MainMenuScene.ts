import {Scene} from "phaser";
import Constants from "../Constants";
import {Button} from "../ui/Button";

export class MainMenuScene extends Scene {
    constructor() {
        super("MainMenu");
    }

    preload() {
        this.load.image("border", "assets/Menu/Border.png")
        this.load.aseprite("btn_continue", "assets/Menu/Button_Continue.png", "assets/Menu/Button_Continue.json")
        this.load.aseprite("btn_new_game", "assets/Menu/Button_NewGame.png", "assets/Menu/Button_NewGame.json")
        this.load.image("logo", "assets/Menu/Logo.png")
        this.load.audio("ui_error", ["assets/audio/sfx/ui/Error.mp3"])
        this.load.audio("ui_navigate", ["assets/audio/sfx/ui/Navigate.mp3"])
        this.load.audio("ui_select", ["assets/audio/sfx/ui/Select.mp3"])
    }

    create() {

        const camera = this.cameras.main;

        // camera.zoom = Constants.UPSCALE_FACTOR;

        // Black Magic value I hate math
        // camera.setScroll(-480, -270);

        this.add.sprite(0,0, "border").setOrigin(0,0).setScale(Constants.UPSCALE_FACTOR)
        const logo = this.add.sprite(0,0, "logo").setOrigin(0,0).setScale(Constants.UPSCALE_FACTOR)

        this.tweens.add({
            targets: logo,
            y: 3 * Constants.UPSCALE_FACTOR,
            duration: 1000,
            ease: 'Linear',
            yoyo: true,
            repeat: -1
        });

        this.add.existing(new Button(this, "btn_new_game",camera.width -250, 150, () => this.startNewGame()).setScale(Constants.UPSCALE_FACTOR))
        this.add.existing(new Button(this, "btn_continue",camera.width -250, 250).setScale(Constants.UPSCALE_FACTOR))
    }

    private startNewGame() {
        this.sys.scenePlugin.start("HUDScene")
        this.sys.scenePlugin.launch("GameScene")
    }
}
