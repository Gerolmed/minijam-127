import {isPlayer, Player} from "../entities/living/Player";
import {Entity} from "../entities/Entity";
import {Animator} from "../animations/Animator";
import GameScene from "../scenes/Game";
import PhysicsLayers from "../entities/PhysicsLayers";
import MatterBodyConfig = Phaser.Types.Physics.Matter.MatterBodyConfig;
import {Item} from "./Item";

export class ItemEntity extends Entity {


    protected rigidbody!: MatterJS.BodyType;
    animator!: Animator;


    constructor(
        scene: GameScene, x?: number, y?: number,
        private readonly item = new Item()
    ) {
        super(scene, x, y);

        this.animator = new Animator(scene, this.item.getBaseSprite())
        this.add(this.animator.root)


        this.rigidbody = this.createPhysics();
        this.rigidbody.gameObject = this;

        const unsubscribeStart = this.gameScene.matterCollisionPlugin.addOnCollideStart(
            {
                objectA: this.rigidbody,
                callback: (event) => {

                    if(isPlayer(event.gameObjectB) && this.hit((event.gameObjectB))) {
                        unsubscribeStart();
                        this.destroy();
                    }
                }
            }
        );
    }

    create() {
        super.create();
        this.item.create(this);
    }

    destroy() {
        this.scene.matter.world.remove(this.rigidbody)
        super.destroy();
    }

    protected safeUpdate(deltaTime: number) {
        super.safeUpdate(deltaTime);
        this.setPosition(this.rigidbody.position.x, this.rigidbody.position.y);
    }

    protected createPhysics() {
        return this.scene.matter.add.circle(this.x, this.y,1, this.createPhysicsConfig())
    }

    protected createPhysicsConfig(): MatterBodyConfig {
        return {
            collisionFilter: {
                category: PhysicsLayers.ITEM,
                mask: PhysicsLayers.WALL | PhysicsLayers.PLAYER
            },
            mass: 20,
            inverseMass: 1/20,
            frictionAir: .8
        }
    }

    protected hit(other: Player) {
        if(this.item.canBeCollected(other))
        other.collectItem(this.item);
        return true;
    }
}
