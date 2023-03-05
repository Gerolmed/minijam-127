import {Entity} from "../Entity";
import {Animator} from "../../animations/Animator";
import {IDamageable, IHealthStatHandler} from "../../damage/IDamageable";
import GameScene from "../../scenes/Game";
import PhysicsLayers from "../PhysicsLayers";
import {IBodyDefinition} from "matter";
import Vector2 = Phaser.Math.Vector2;
import Color = Phaser.Display.Color;

export class LivingEntity extends Entity implements IDamageable {
    protected readonly animator: Animator;
    protected readonly rigidbody: MatterJS.BodyType;


    private health!: number;
    private maxHealth!: number;
    private statHandler?: IHealthStatHandler;
    protected physicsOffset = new Vector2();

    constructor(scene: GameScene, x?: number, y?: number) {
        super(scene, x, y);
        this.animator = new Animator(scene);
        this.add(this.animator.root);
        this.rigidbody = this.createPhysics();
        this.rigidbody.gameObject = this;

        this.setupHealth(50);

    }

    protected setupHealth(health: number) {
        this.maxHealth = health;
        this.health = this.maxHealth;
        this.statHandler?.onHealthChange(this.health, this.maxHealth);
    }

    protected safeUpdate(deltaTime: number) {
        super.safeUpdate(deltaTime);
        this.setPosition(this.rigidbody.position.x + this.physicsOffset.x, this.rigidbody.position.y + this.physicsOffset.y);
    }
    protected createPhysics() {
        const Matter = this.scene.matter;


        const base = Matter.body.create({
            parts: this.assembleParts(),
            inertia: Infinity,
            inverseInertia: 0,

            ...this.createPhysicsConfig()
        })
        this.scene.matter.world.add(base)
        return base;
    }

    getMaxHealth() {
        return this.maxHealth;
    }

    getHealth() {
        return this.health;
    }
    heal(amount: number) {
        this.health = Math.min(this.health+amount, this.maxHealth);
        this.statHandler?.onHealthChange(this.health, this.maxHealth);
    }

    protected assembleParts() {
        const Matter = this.scene.matter;

        return [
            Matter.bodies.circle(this.x, this.y,8), // was 12 and below too
            Matter.bodies.circle(this.x, this.y+12,8),
        ]
    }

    protected createPhysicsConfig(): IBodyDefinition {
        return {
            collisionFilter: {
                group: 0,
                mask: PhysicsLayers.All,
                category: this.getPhysicsLayer(),
            },
            frictionAir: .1,
            friction: 0,
            mass: 20,
            inverseMass: 1/20,
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

        this.animator.doColorFade(new Color(255,255,255), this.getDamageColor(), 50, false)
            .then(() => this.animator.doColorFade(this.getDamageColor(), new Color(255,255,255), 100))

        if(this.health <= 0) this.death();

    }


    getDamageColor() {
        return new Color(212,113,93);
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
        this.statHandler.onHealthChange(this.health, this.maxHealth)
    }

    /**
     * Just for setup don't use
     * @protected
     */
    protected getPhysicsLayer() {
        return PhysicsLayers.PLAYER;
    }
}
