import Graphics = Phaser.GameObjects.Graphics;
import {IHealthStatHandler} from "../damage/IDamageable";
import {Scene} from "phaser";
import Vector2 = Phaser.Math.Vector2;

export class EnemyHealthBar extends Graphics implements IHealthStatHandler{

    constructor(scene: Scene,private readonly offset: Vector2) {
        super(scene);
    }

    onHealthChange(health: number, maxHealth: number): void {
        this.clear()
        if(health === maxHealth) return;

        this.fillStyle(0x4d234a, 1);

        const totalWidth = 20;
        const fullFillWidth = 20-2;
        const fillWidth = Math.ceil(fullFillWidth * health/maxHealth);

        this.fillRect(this.offset.x-totalWidth/2,this.offset.y, totalWidth,3)
        this.fillStyle(0xd4715d, 1);
        this.fillRect(this.offset.x-fullFillWidth/2,this.offset.y+1, fillWidth,1)
    }

}
