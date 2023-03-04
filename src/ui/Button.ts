import Sprite = Phaser.GameObjects.Sprite;
import {Scene} from "phaser";

export class Button extends Sprite {
    constructor(scene: Scene, baseName: string, x: number, y: number, private readonly action?: () => any) {
        super(scene, x ,y, baseName);
        this.anims.createFromAseprite(baseName)
        this.anims.play("Normal")

        this.setInteractive({ cursor: 'pointer' })

        this.on("pointerdown", () => {

            this.anims.play("Click")

        });

        this.on("pointerout",  () => {

            this.anims.play("Normal")

        });

        this.on("pointerover",  () => {
            this.anims.play("Hover")

        });

        this.on("pointerup",  () => {

            this.anims.play("Hover");
            this.action?.();

        });
    }
}
