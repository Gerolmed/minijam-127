import {doAlphaTween, doTextTween} from "../animations/ColorUtils";
import {Scene} from "phaser";
import Constants from "../Constants";

export class SaveScreen {

    constructor(
        private readonly scene: Scene,
    ) {
    }
    async doSaveFade(doSave: () => Promise<void>): Promise<void> {
        const camera = this.scene.cameras.main;


        const graphics = this.scene.add.graphics()
        const saveTextContent = "Saving..."
        const saveText = this.scene.add.text(camera.displayWidth/2, camera.displayHeight/2, "" , { fontFamily: "EndFont", fontSize: 100}).setScale(.2 * Constants.UPSCALE_FACTOR).setOrigin(.5,.5)
        graphics.setAlpha(0)
        graphics.fillStyle(0x4d234a)
        graphics.fillRect(0,0, camera.displayWidth, camera.displayHeight)

        await doAlphaTween(this.scene, 0, 1, 1000, (a) => graphics.setAlpha(a))
        await new Promise(res => setTimeout(res,200))
        await Promise.all([doSave(), doTextTween(this.scene, saveTextContent, 1000, txt => saveText.setText(txt))]);
        await new Promise(res => setTimeout(res,200))
        await doAlphaTween(this.scene, 1, 0, 1000, (a) => graphics.setAlpha(a))
        graphics.destroy(true)
        saveText.destroy(true)
    }
}
