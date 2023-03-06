import Sprite = Phaser.GameObjects.Sprite;
import {Scene} from "phaser";
import AudioManager from "../util/AudioManager";

export class Button extends Sprite {
    constructor(scene: Scene, baseName: string, x: number, y: number, private readonly action?: () => any) {
        super(scene, x ,y, baseName);
        this.anims.createFromAseprite(baseName)
        this.anims.play("Normal")

        const navigateSound = this.scene.sound.add("ui_navigate", {volume: AudioManager.getSFXVolume()});
        const selectSound = this.scene.sound.add("ui_select", {volume: AudioManager.getSFXVolume()});

        this.setInteractive({ cursor: 'pointer' })

        this.on("pointerdown", () => {

            this.anims.play("Click")

        });

        this.on("pointerout",  () => {

            this.anims.play("Normal")

        });

        this.on("pointerover",  () => {
            this.anims.play("Hover")
            navigateSound.play()
        });

        this.on("pointerup",  () => {

            this.anims.play("Hover");
            selectSound.play()
            this.action?.();
        });
    }
}
