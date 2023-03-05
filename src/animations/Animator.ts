import GameObject = Phaser.GameObjects.GameObject;
import {Scene} from "phaser";
import Sprite = Phaser.GameObjects.Sprite;
import PlayerAnimationKeys from "./PlayerAnimationKeys";
import Color = Phaser.Display.Color;
import {doColorTween} from "./ColorUtils";

export class Animator {

    private readonly rootInstance: Sprite;

    constructor(
        private scene: Scene,
        baseSprite = PlayerAnimationKeys.BASE
    ) {
        this.rootInstance = new Sprite(scene, 0,0, baseSprite);
    }

    public play(animation: string, repeat = -1, replace = false, onStop?: () => any) {
        if(!replace && this.rootInstance.anims.getName() === animation) return

        this.rootInstance.play({
            key: animation,
            repeat: repeat
        });

        let hasRunStop = false;

        this.rootInstance.once("animationcomplete", () => {
            if(hasRunStop) return;
            hasRunStop = true;
            onStop?.()
        });
        this.rootInstance.once("animationstop", () => {
            if(hasRunStop) return;
            hasRunStop = true;
            onStop?.()
        });
    }

    public get root(): GameObject {
        return this.rootInstance;
    }

    public load(sheet: string) {
        this.rootInstance.anims.createFromAseprite(sheet)
    }

    setTint(color: number) {
        this.rootInstance.tint = color;
    }

    doColorFade(from: Color, to: Color, duration: number, resetToWhite = false) {
        return doColorTween(this.scene, from, to, duration, (col) => this.setTint(col)).then(() => {
            if(resetToWhite) {
                this.setTint(0xffffff)
            }
        })
    }
}
