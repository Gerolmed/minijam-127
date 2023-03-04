import Container = Phaser.GameObjects.Container;
import TimeManager from "../TimeManager";
import GameScene from "../scenes/Game";

export class Entity extends Container {

    constructor(scene: GameScene, x?: number, y?: number) {
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
        this.safeUpdate(deltaTime/1000);
    }
    protected safeUpdate(deltaTime: number): void {

    }

    get gameScene() {
        return this.scene as GameScene;
    }

}
