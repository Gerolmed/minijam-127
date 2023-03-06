import {doAlphaTween, doTextTween} from "../animations/ColorUtils";
import {Scene} from "phaser";
import AudioManager from "../util/AudioManager";
import Constants from "../Constants";
import GameObject = Phaser.GameObjects.GameObject;

export class DeathScreen {

    constructor(
        private readonly scene: Scene,
    ) {
    }

    private resolve?: () => void;

    private objects: GameObject[] = [];


    remove() {
        this.resolve = undefined;

        this.objects.forEach(obj => obj.destroy(true));
        this.objects = [];
    }

    async doDeathFade(): Promise<void> {
        const camera = this.scene.cameras.main;

        const graphics = this.scene.add.graphics()
        const deathTextContent = "You died..."
        const deathText = this.scene.add.text(camera.displayWidth/2, camera.displayHeight/2, "" , { fontFamily: "EndFont", fontSize: 100}).setScale(.2* Constants.UPSCALE_FACTOR).setOrigin(.5,.5)
        graphics.setAlpha(0)
        graphics.fillStyle(0x4d234a)
        graphics.fillRect(0,0, camera.displayWidth, camera.displayHeight)

        await doAlphaTween(this.scene, 0, 1, 3000, (a) => graphics.setAlpha(a))
        await new Promise(res => setTimeout(res,200))
        this.scene.sound.add("game_over", {volume: AudioManager.getMusicVolume()}).play()
        await doTextTween(this.scene, deathTextContent, 3000, txt => deathText.setText(txt));
        await new Promise(res => setTimeout(res,500))
        const tmp = this.scene.add.text(camera.displayWidth/2, camera.displayHeight/2+12 * Constants.UPSCALE_FACTOR, "Press 'space' to continue" , { fontFamily: "EndFont", fontSize: 100}).setScale(.06* Constants.UPSCALE_FACTOR).setOrigin(.5,.5)

        this.scene.input.keyboard?.addKey("space").once("down", () => {
            this.resolve?.();
        })

        await new Promise<void>(res => this.resolve = res)

        this.objects.push(graphics, deathText, tmp);
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
