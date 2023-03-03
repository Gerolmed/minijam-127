import {Entity} from "../Entity";
import {Animator} from "../../animations/Animator";
import {Scene} from "phaser";
import MatterBodyConfig = Phaser.Types.Physics.Matter.MatterBodyConfig;

export class LivingEntity extends Entity {
    protected readonly animator: Animator;
    protected readonly rigidbody: MatterJS.BodyType;
    constructor(scene: Scene, x?: number, y?: number) {
        super(scene, x, y);
        this.animator = new Animator(scene);
        this.add(this.animator.root);
        this.rigidbody = this.createPhysics();
    }

    protected safeUpdate(deltaTime: number) {
        super.safeUpdate(deltaTime);
        this.setPosition(this.rigidbody.position.x, this.rigidbody.position.y);
    }

    protected createPhysics() {
        return this.scene.matter.add.circle(this.x, this.y,30, this.createPhysicsConfig())
    }

    protected createPhysicsConfig(): MatterBodyConfig {
        return {
        }
    }

}
