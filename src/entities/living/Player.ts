import {LivingEntity} from "./LivingEntity";
import PlayerAnimationKeys from "../../animations/PlayerAnimationKeys";
import {PlayerIngameInput} from "../../inputs/PlayerIngameInput";

export class Player extends LivingEntity {

    private speed = 20;
    private acceleration = 50;
    private playerInput!: PlayerIngameInput;

    public create() {

        this.playerInput = new PlayerIngameInput(this.scene);
        this.animator.load(PlayerAnimationKeys.BASE);
        this.animator.play(PlayerAnimationKeys.IDLE_DOWN);
    }

    protected createPhysicsConfig(): Phaser.Types.Physics.Matter.MatterBodyConfig {
        return {
            ...super.createPhysicsConfig(),
            frictionAir: .3,
            mass: 2,
            inverseMass: 1/2,
        };
    }

    protected safeUpdate(deltaTime: number) {
        super.safeUpdate(deltaTime);
        this.handleMovement(deltaTime);
    }

    private handleMovement(deltaTime: number) {
        const dir = this.playerInput.getMovementVector();
        let targetX = dir.x * this.speed;
        let targetY = dir.y * this.speed;
        const current = this.rigidbody.velocity;

        if(targetX > 0) {
            targetX = Math.min(current.x + dir.x * this.acceleration * deltaTime, targetX)
            targetX = Math.max(current.x, targetX)
        } else {
            targetX = Math.max(current.x + dir.x * this.acceleration * deltaTime, targetX)
            targetX = Math.min(current.x, targetX)
        }
        if(targetY > 0) {
            targetY = Math.min(current.y + dir.y * this.acceleration * deltaTime, targetY)
            targetY = Math.max(current.y, targetY)
        } else {
            targetY = Math.max(current.y + dir.y * this.acceleration * deltaTime, targetY)
            targetY = Math.min(current.y, targetY)
        }

        if(dir.y > 0) {
            this.animator.play(PlayerAnimationKeys.IDLE_DOWN)
        } else if(dir.y < 0) {
            this.animator.play(PlayerAnimationKeys.IDLE_UP)
        } else {
            if(dir.x > 0) {
                this.animator.play(PlayerAnimationKeys.IDLE_RIGHT)
            } else if(dir.x < 0) {
                this.animator.play(PlayerAnimationKeys.IDLE_LEFT)
            }
        }

        this.scene.matter.setVelocity(this.rigidbody, targetX, targetY);
    }

}
