import GameObject = Phaser.GameObjects.GameObject;
import {Scene} from "phaser";
import Sprite = Phaser.GameObjects.Sprite;

export class Animator {

    private readonly rootInstance: Sprite;

    constructor(
        private scene: Scene
    ) {
        this.rootInstance = new Sprite(scene, 0,0, "logo");
    }

    public get root(): GameObject {
        return this.rootInstance;
    }
}
