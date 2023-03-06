import {Scene} from "phaser";
import {Player} from "../entities/living/Player";
import Constants from "../Constants";
import Vector2 = Phaser.Math.Vector2;

export class PlayerMiniMap {
    private map: Phaser.GameObjects.Sprite;
    private marker: Phaser.GameObjects.Sprite;
    private mapKey: Phaser.Input.Keyboard.Key;
    private cameraShape: Vector2;
    constructor(private readonly scene: Scene, private readonly player: Player) {

        const camera = scene.cameras.main;
        this.cameraShape = new Vector2(camera.displayWidth, camera.displayHeight);

        this.map = scene.add.sprite(camera.displayWidth/2,camera.displayHeight/2, "minimap").setScale(Constants.UPSCALE_FACTOR)
        this.map.setVisible(false);
        this.map.setOrigin(.5,.5)
        this.marker = scene.add.sprite(0,0, "minimap_marker").setScale(Constants.UPSCALE_FACTOR)
        this.marker.setVisible(false);
        this.marker.setOrigin(.5,1)
        this.mapKey = this.scene.input.keyboard?.addKey("m")!
    }

    update() {
        this.map.setVisible(this.mapKey.isDown)
        this.marker.setVisible(this.mapKey.isDown)
        if(this.mapKey.isDown) {
            const mapPos = this.getMapPos();
            this.marker.setPosition(mapPos.x, mapPos.y)
        }
    }
    remove() {
        this.map.destroy(true)
        this.marker.destroy(true)
        this.mapKey.destroy()
    }

    private getMapPos() {
        return new Vector2(this.player.x, this.player.y).scale(1/14.6).add(new Vector2(166,162)).scale(Constants.UPSCALE_FACTOR);
    }
}
