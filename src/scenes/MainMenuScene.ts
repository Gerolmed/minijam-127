import {Scene} from "phaser";
import Constants from "../Constants";
import {Button} from "../ui/Button";
import {Jukebox} from "../audio/JukeBox";
import {PersistenceManager} from "../persistence/PersistenceManager";
import {WorldStoreManager} from "../world/WorldSave";

export class MainMenuScene extends Scene {

    private readonly jukebox!: Jukebox;


    constructor() {
        super("MainMenu");

        this.jukebox = new Jukebox(this, {
            defaultTheme: "overworld",
            themes: {
                overworld: [
                    {
                        paths: [
                            "assets/audio/music/overworld/Theme.mp3",
                        ]
                    },
                ]
            }
        });
    }

    preload() {
        this.jukebox.load();

        this.load.image("border", "assets/Menu/Border.png")
        this.load.aseprite("btn_continue", "assets/Menu/Button_Continue.png", "assets/Menu/Button_Continue.json")
        this.load.aseprite("btn_new_game", "assets/Menu/Button_NewGame.png", "assets/Menu/Button_NewGame.json")
        this.load.aseprite("btn_discord", "assets/Menu/Discord.png", "assets/Menu/Discord.json")
        this.load.image("logo", "assets/Menu/Logo.png")
        this.load.image("splat_cat", "assets/Menu/SplatCat.png")
        this.load.audio("ui_error", ["assets/audio/sfx/ui/Error.mp3"])
        this.load.audio("ui_navigate", ["assets/audio/sfx/ui/Navigate.mp3"])
        this.load.audio("ui_select", ["assets/audio/sfx/ui/Select.mp3"])
    }

    create() {
        this.jukebox.start();

        const camera = this.cameras.main;


        this.add.sprite(0,0, "border").setOrigin(0,0).setScale(Constants.UPSCALE_FACTOR)
        const splatCat = this.add.sprite(0,0, "splat_cat").setOrigin(0,0).setScale(Constants.UPSCALE_FACTOR)
        splatCat.setPosition(camera.width / 2 - splatCat.displayWidth/2, camera.height - splatCat.displayHeight)
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
        this.add.existing(new Button(this, "btn_continue",camera.width -250, 250, () => this.continueGame()).setScale(Constants.UPSCALE_FACTOR))
        this.add.existing(new Button(this, "btn_discord",camera.width -120, camera.height - 90, () => this.visitDiscord()).setScale(Constants.UPSCALE_FACTOR))

        this.events.on('shutdown', () => this.jukebox.kill())

        const persistenceManager = PersistenceManager.get();
        persistenceManager.connect().then(() => {
            console.log("Connected to database")
            WorldStoreManager.loadFromDatabase().then(() => {
                console.log("Restored world save")
            })
        })
    }

    update(time: number, delta: number) {
        super.update(time, delta);
        this.jukebox.update(delta/1000)
    }


    private startNewGame() {
        WorldStoreManager.get().clear().then(() => {
            this.sys.scenePlugin.start("HUDScene");
            this.sys.scenePlugin.launch("GameScene");
        });
    }
    private visitDiscord() {
        window.open("https://endrealm.net/discord",'_blank');
    }
    private continueGame() {
        this.sys.scenePlugin.start("HUDScene");
        this.sys.scenePlugin.launch("GameScene");
    }
}
