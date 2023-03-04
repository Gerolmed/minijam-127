import {Entity} from "../Entity";
import {Animator} from "../../animations/Animator";
import {Scene} from "phaser";
import MatterBodyConfig = Phaser.Types.Physics.Matter.MatterBodyConfig;
import {IDamageable, IHealthStatHandler} from "../../damage/IDamageable";

export class LivingEntity extends Entity implements IDamageable {
    protected readonly animator: Animator;
    protected readonly rigidbody: MatterJS.BodyType;


    private health: number;
    private maxHealth: number;
    private statHandler?: IHealthStatHandler;

    constructor(scene: Scene, x?: number, y?: number) {
        super(scene, x, y);
        this.animator = new Animator(scene);
        this.add(this.animator.root);
        this.rigidbody = this.createPhysics();
        this.rigidbody.gameObject = this;

        this.maxHealth = 50;
        this.health = this.maxHealth;
        this.statHandler?.onHealthChange(this.health, this.maxHealth);

    }

    protected safeUpdate(deltaTime: number) {
        super.safeUpdate(deltaTime);
        this.setPosition(this.rigidbody.position.x, this.rigidbody.position.y);
    }

    protected createPhysics() {
        return this.scene.matter.add.circle(this.x, this.y,10, this.createPhysicsConfig())
    }

    protected createPhysicsConfig(): MatterBodyConfig {
        return {
            frictionAir: .1,
            friction: 0,
        }
    }

    addMaxHealth(value: number): void {
        this.health += value;
        this.maxHealth += value;
        this.statHandler?.onHealthChange(this.health, this.maxHealth);
    }

    damage(damage: number, knockBack?: Phaser.Math.Vector2): void {
        this.health -= damage;

        this.statHandler?.onHealthChange(this.health, this.maxHealth);

        if(this.health < 0) this.death();

    }

    death() {
        this.destroy();
    }


    destroy() {
        this.scene.matter.world.remove(this.rigidbody);
        super.destroy();
    }

    setHandler(handler: IHealthStatHandler): void {
        this.statHandler = handler;
    }

}
