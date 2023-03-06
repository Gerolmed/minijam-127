import {Entity} from "../Entity";
import GameScene from "../../scenes/Game";
import PhysicsLayers from "../PhysicsLayers";
import {Animator} from "../../animations/Animator";
import TimeManager from "../../TimeManager";
import MatterBodyConfig = Phaser.Types.Physics.Matter.MatterBodyConfig;
import GameObject = Phaser.GameObjects.GameObject;
import Vector2 = Phaser.Math.Vector2;

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

    update(deltaTime: number) {
        this.detectGameFreeze();
        super.update(deltaTime);
    }

    protected safeUpdate(deltaTime: number) {
        super.safeUpdate(deltaTime);
        this.setPosition(this.rigidbody.position.x, this.rigidbody.position.y);
    }

    protected createPhysics() {
        return this.scene.matter.add.circle(this.x, this.y,5 * this.hitBoxSizeMod, this.createPhysicsConfig())
    }

    isProjectile() {
        return true;
    }

    protected createPhysicsConfig(): MatterBodyConfig {
        const otherType = this.selfMask == PhysicsLayers.PLAYER_PROJECTILE ? PhysicsLayers.ENEMY_PROJECTILE : PhysicsLayers.PLAYER_PROJECTILE;
        return {
            collisionFilter: {
                category: this.selfMask,
                mask: PhysicsLayers.WALL | this.hitTeamMask | otherType
            },
            mass: 1,
            inverseMass: 1,
        }
    }

    protected hit(other: GameObject | undefined) {
        return true;
    }

    private isGameFrozen = false;
    private frozenVel = new Vector2();
    private detectGameFreeze() {
        if(TimeManager.isGameFrozen === this.isGameFrozen) return;
        this.isGameFrozen = TimeManager.isGameFrozen;

        if(TimeManager.isGameFrozen) {
            this.frozenVel = new Vector2(this.rigidbody.velocity.x, this.rigidbody.velocity.y);
            this.scene.matter.body.setVelocity(this.rigidbody, new Vector2());
            this.setPosition(this.rigidbody.position.x, this.rigidbody.position.y);
        } else {

            this.scene.matter.body.setVelocity(this.rigidbody, this.frozenVel);
        }
    }
}


export function isProjectile(obj: any): obj is ProjectileEntity {
    return obj && typeof obj.isProjectile === "function" && obj.isProjectile();
}
