import {Scene} from "phaser";
import Constants from "../Constants";
import {Button} from "../ui/Button";

export class PressToStart extends Scene {
    constructor() {
        super("PressToStart");
    }

    preload() {
        this.load.audio("ui_select", ["assets/audio/sfx/ui/Select.mp3"])
    }

    create() {
        const camera = this.cameras.main;
        const back = this.add.graphics()
        back.fillStyle(0xffae70, 1)
        back.fillRect(0,0, camera.width, camera.height);

        this.add.text(camera.width/2, camera.height/2, "Press \"space\" to start", {fontFamily: "EndFont", fontSize: 45})
            .setOrigin(0.5,0.5)
        this.add.text(camera.width/2, camera.height/2+40, "No not 'any' button its 'space' specifically\n for reasons...", {fontFamily: "EndFont", fontSize: 20, align: "center", color: "#d4715d"})
            .setOrigin(0.5,0.5)

        this.input.keyboard!.addKey("space").on("down", () => this.openMenu());
    }

    private openMenu() {
        this.sound.add("ui_select").play();
        this.sys.scenePlugin.start("MainMenu")
    }
}
