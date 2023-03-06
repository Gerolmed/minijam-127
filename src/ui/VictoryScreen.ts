import {doAlphaTween, doTextTween} from "../animations/ColorUtils";
import {Scene} from "phaser";
import AudioManager from "../util/AudioManager";

export class VictoryScreen {

    constructor(
        private readonly scene: Scene,
    ) {
    }

    private resolve?: () => void;
    async doFade(): Promise<void> {

        this.scene.input.keyboard?.addKey("space").on("down", () => {
            this.resolve?.();
        })

        const camera = this.scene.cameras.main;

        const graphics = this.scene.add.graphics()
        const deathTextContent = "Victory Royale #1"
        const deathText = this.scene.add.text(camera.displayWidth/2, camera.displayHeight/2, "" , { fontFamily: "EndFont", fontSize: 100}).setScale(.2).setOrigin(.5,.5)
        graphics.setAlpha(0)
        graphics.fillStyle(0xffae70)
        graphics.fillRect(0,0, camera.displayWidth, camera.displayHeight)

        await doAlphaTween(this.scene, 0, 1, 3000, (a) => graphics.setAlpha(a))
        await new Promise(res => setTimeout(res,200))
        this.scene.sound.add("victory", {volume: AudioManager.getMusicVolume()})?.play()
        await doTextTween(this.scene, deathTextContent, 2000, txt => deathText.setText(txt));
        await new Promise(res => setTimeout(res,500))
        this.scene.add.text(camera.displayWidth/2, camera.displayHeight/2+12, "Congrats :D Leave a comment or join our discord and talk to us" , { fontFamily: "EndFont", fontSize: 100, color: "#d4715d"}).setScale(.06).setOrigin(.5,.5)


        await new Promise<void>(res => this.resolve = res)
    }
}
