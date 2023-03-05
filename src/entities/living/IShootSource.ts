import Vector2 = Phaser.Math.Vector2;
import GameScene from "../../scenes/Game";

export interface IShootSource {
    get isAlive(): boolean;
    get gameScene(): GameScene;
    getShootPos(dir: Vector2): Vector2;
}
