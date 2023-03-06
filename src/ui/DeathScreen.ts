import {doAlphaTween, doTextTween} from "../animations/ColorUtils";
import {Scene} from "phaser";
import AudioManager from "../util/AudioManager";

export class DeathScreen {

    constructor(
        private readonly scene: Scene,
    ) {
    }

    private resolve?: () => void;
    async doDeathFade(): Promise<void> {

        this.scene.input.keyboard?.addKey("space").on("down", () => {
            this.resolve?.();
        })

        const camera = this.scene.cameras.main;

        const graphics = this.scene.add.graphics()
        const deathTextContent = "You died..."
        const deathText = this.scene.add.text(camera.displayWidth/2, camera.displayHeight/2, "" , { fontFamily: "EndFont", fontSize: 100}).setScale(.2).setOrigin(.5,.5)
        graphics.setAlpha(0)
        graphics.fillStyle(0x4d234a)
        graphics.fillRect(0,0, camera.displayWidth, camera.displayHeight)

        await doAlphaTween(this.scene, 0, 1, 3000, (a) => graphics.setAlpha(a))
        await new Promise(res => setTimeout(res,200))
        this.scene.sound.add("game_over", {volume: AudioManager.getMusicVolume()}).play()
        await doTextTween(this.scene, deathTextContent, 3000, txt => deathText.setText(txt));
        await new Promise(res => setTimeout(res,500))
        this.scene.add.text(camera.displayWidth/2, camera.displayHeight/2+12, "Press 'space' to continue" , { fontFamily: "EndFont", fontSize: 100}).setScale(.06).setOrigin(.5,.5)


        await new Promise<void>(res => this.resolve = res)
    }
    async doDeathFadeAway(): Promise<void> {

        this.scene.input.keyboard?.addKey("space").on("down", () => {
            this.resolve?.();
        })

        const camera = this.scene.cameras.main;

        const graphics = this.scene.add.graphics()
        graphics.setAlpha(1)
        graphics.fillStyle(0x4d234a)
        graphics.fillRect(0,0, camera.displayWidth, camera.displayHeight)

        await doAlphaTween(this.scene, 1, 0, 1000, (a) => graphics.setAlpha(a))
    }
}
