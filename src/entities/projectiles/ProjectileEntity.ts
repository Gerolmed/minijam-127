import {Entity} from "../Entity";
import GameScene from "../../scenes/Game";
import PhysicsLayers from "../PhysicsLayers";
import {Animator} from "../../animations/Animator";
import MatterBodyConfig = Phaser.Types.Physics.Matter.MatterBodyConfig;
import GameObject = Phaser.GameObjects.GameObject;

export class ProjectileEntity extends Entity {
    protected rigidbody!: MatterJS.BodyType;
    protected animator!: Animator;


    constructor(
        scene: GameScene, x?: number, y?: number,
        private readonly hitTeamMask: number = PhysicsLayers.ENEMY | PhysicsLayers.PLAYER,
        private readonly selfMask: number = PhysicsLayers.PLAYER_PROJECTILE,
        private readonly hitBoxSizeMod = 1,
    ) {
        super(scene, x, y);

        this.animator = new Animator(scene)
        this.add(this.animator.root)


        this.rigidbody = this.createPhysics();
        this.rigidbody.gameObject = this;

        const unsubscribe = this.gameScene.matterCollisionPlugin.addOnCollideStart(
            {
                objectA: this.rigidbody,
                callback: (event) => {
                    unsubscribe();

                    if(this.hit((event.gameObjectB as GameObject | undefined))) {
                        this.destroy()
                    }
                }
            }
        );
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
        return this.scene.matter.add.circle(this.x, this.y,5 * this.hitBoxSizeMod, this.createPhysicsConfig())
    }

    protected createPhysicsConfig(): MatterBodyConfig {
        return {
            collisionFilter: {
                category: this.selfMask,
                mask: PhysicsLayers.WALL | this.hitTeamMask
            },
            mass: 1,
            inverseMass: 1,
        }
    }

    protected hit(other: GameObject | undefined) {
        return true;
    }
}
