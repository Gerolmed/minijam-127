import {Scene} from "phaser";
import {Player} from "../entities/living/Player";
import {IHealthStatHandler} from "../damage/IDamageable";
import Constants from "../Constants";

export class PlayerHealthBar implements IHealthStatHandler{
    private frame: Phaser.GameObjects.NineSlice;
    private fill: Phaser.GameObjects.NineSlice;
    private text: Phaser.GameObjects.Sprite;
    constructor(private readonly scene: Scene, player: Player) {

        this.frame = scene.add.nineslice(0,2, "hp_bar_frame", 0, 50, 9,3,3,3,3)
        this.fill = scene.add.nineslice(0,2, "hp_bar_fill", 0, 50, 9,3,3,3,3)
        this.text = scene.add.sprite(0,2, "hp_bar_text")


        this.frame.setOrigin(0,0)
        this.fill.setOrigin(0,0)
        this.text.setOrigin(0,0)
        player.setHandler(this)
    }

    private recenter() {
        const half = this.scene.cameras.main.width/2
        this.frame.x = half/Constants.UPSCALE_FACTOR - this.frame.width/2;
        this.fill.x = half/Constants.UPSCALE_FACTOR - this.frame.width/2;
        this.text.x = half/Constants.UPSCALE_FACTOR - this.frame.width/2;
    }

    onHealthChange(health: number, maxHealth: number): void {
        this.frame.width = maxHealth;
        this.fill.width = health;
        this.recenter()
    }
}
