import {doAlphaTween, doTextTween} from "../animations/ColorUtils";
import {Scene} from "phaser";

export class DeathScreen {

    constructor(
        private readonly scene: Scene,
    ) {
        scene.input.keyboard?.addKey("space").on("down", () => {
            this.resolve?.();
        })
    }

    private resolve?: () => void;
    async doDeathFade(): Promise<void> {
        const camera = this.scene.cameras.main;

        const graphics = this.scene.add.graphics()
        const deathTextContent = "You died..."
        const deathText = this.scene.add.text(camera.displayWidth/2, camera.displayHeight/2, "" , { fontFamily: "EndFont", fontSize: 100}).setScale(.2).setOrigin(.5,.5)
        graphics.setAlpha(0)
        graphics.fillStyle(0x4d234a)
        graphics.fillRect(0,0, camera.displayWidth, camera.displayHeight)

        await doAlphaTween(this.scene, 0, 1, 1000, (a) => graphics.setAlpha(a))
        await new Promise(res => setTimeout(res,200))
        await doTextTween(this.scene, deathTextContent, 1000, txt => deathText.setText(txt));
        await new Promise(res => setTimeout(res,1000))
        await new Promise<void>(res => this.resolve = res)
    }
}
