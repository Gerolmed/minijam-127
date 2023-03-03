import Container = Phaser.GameObjects.Container;
import TimeManager from "../TimeManager";
import {Scene} from "phaser";

export class Entity extends Container {

    constructor(scene: Scene, x?: number, y?: number) {
        super(scene, x, y);
    }

    public create() {
    }

    public destroy() {

    }

    public preUpdate(time: number, delta: number) {
        this.update(delta);
    }

    public update(deltaTime: number): void {
        if(TimeManager.isGameFrozen) return;
        this.safeUpdate(deltaTime);
    }
    protected safeUpdate(deltaTime: number): void {

    }

}
