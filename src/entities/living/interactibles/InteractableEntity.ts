import {LivingEntity} from "../LivingEntity";
import {Player} from "../Player";
import PhysicsLayers from "../../PhysicsLayers";
import GameScene from "../../../scenes/Game";
import {PhysicsSocket} from "../PhysicsSocket";
import Vector2 = Phaser.Math.Vector2;
import Key = Phaser.Input.Keyboard.Key;
import TimeManager from "../../../TimeManager";
import GameObject = Phaser.GameObjects.GameObject;

export class InteractableEntity extends LivingEntity {

    private insidePlayer?: Player;
    private interactionIndicator?: GameObject

    constructor(scene: GameScene, x: number, y: number, private readonly socket: PhysicsSocket) {
        super(scene, x, y);
    }

    protected createPhysicsConfig(): MatterJS.IBodyDefinition {
        return {
            ...super.createPhysicsConfig(),
            isStatic: true,
            collisionFilter: {
                group: 0,
                mask: PhysicsLayers.All - PhysicsLayers.ENEMY - PhysicsLayers.ENEMY_PROJECTILE - PhysicsLayers.WALL,
                category: this.getPhysicsLayer(),
            },
        };
    }

    protected getPhysicsLayer(): number {
        return PhysicsLayers.INTERACTABLE;
    }

    create() {
        super.create();
        this.getInteractKey().on("down",() => {
            if(TimeManager.isGameFrozen) return;
            if(!this.insidePlayer) return;
            this.doInteract(this.insidePlayer);
        });
    }

    death() {
        // DO NOTHING
    }

    protected assembleParts() {
        const Matter = this.scene.matter;

        return [
            Matter.bodies.circle(this.x, this.y,8), // was 12 and below too
            Matter.bodies.circle(this.x, this.y+12,8, {isSensor: true}),
        ]
    }

    protected safeUpdate(deltaTime: number) {
        super.safeUpdate(deltaTime);
        const player = this.socket.getPlayer();
        if(!player) return;
        if(this.getInteractCenter().distanceSq(new Vector2(player.x, player.y)) <= this.getInteractRangeSQ()) {
            this.tryEnter(player);
        } else {
            this.tryExit(player);
        }
    }

    private tryEnter(player: Player) {
        if(this.insidePlayer) return;

        this.insidePlayer = player;
        this.doEnter(player);
    }
    private tryExit(player: Player) {
        if(!this.insidePlayer) return;
        this.doExit(player);
        this.insidePlayer = undefined;
    }


    protected doEnter(player: Player) {
        this.interactionIndicator = this.createIndicator(this.x, this.y-24)

    }
    protected doExit(player: Player) {
        this.interactionIndicator?.destroy(true);
    }

    protected doInteract(player: Player) {
         console.log("test")
    }

    private getInteractCenter() {
        return new Vector2(this.x, this.y)
    }
    private getInteractKey() {
        return this.scene.input.keyboard!.addKey("space");
    }
    private getInteractRangeSQ() {
        return 32*32
    }

    private createIndicator(x: number, y: number): GameObject {
        const textScale = 0.1;
        const text = this.scene.add.text(x, y, "Space to talk", {fontFamily: "EndFont", fontSize: 50}).setScale(textScale);
        text.setX(text.x-text.displayWidth/2)
        return text;
    }
}
