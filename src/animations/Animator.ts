import GameObject = Phaser.GameObjects.GameObject;
import {Scene} from "phaser";
import Sprite = Phaser.GameObjects.Sprite;

export class Animator {

    private readonly rootInstance: Sprite;

    constructor(
        private scene: Scene,
        private animationSheets: string[] = []
    ) {
        this.rootInstance = new Sprite(scene, 0,0, "logo");

        animationSheets.forEach(sheet => this.load(sheet))
    }

    public play(animation: string, repeat = -1, replace = false) {
        if(!replace && this.rootInstance.anims.getName() === animation) return

        this.rootInstance.play({
            key: animation,
            repeat: repeat
        })
    }

    public get root(): GameObject {
        return this.rootInstance;
    }

    public load(sheet: string) {
        this.rootInstance.anims.createFromAseprite(sheet)
    }
}
