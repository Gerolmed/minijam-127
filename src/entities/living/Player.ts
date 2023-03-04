import {LivingEntity} from "./LivingEntity";
import CursorKeys = Phaser.Types.Input.Keyboard.CursorKeys;
import Key = Phaser.Input.Keyboard.Key;
import Vector2 = Phaser.Math.Vector2;
import PlayerAnimationKeys from "../../animations/PlayerAnimationKeys";

export class Player extends LivingEntity {

    private arrow!: CursorKeys;
    private speed = 20;
    private acceleration = 50;
    private movement!: {
        up: Key,
        down: Key,
        left: Key,
        right: Key,
    }

    public create() {

        const keyboard = this.scene.input.keyboard!;

        this.movement = {
            up: keyboard.addKey("w"),
            down: keyboard.addKey("s"),
            left: keyboard.addKey("a"),
            right: keyboard.addKey("d"),
        }

        this.arrow = keyboard.createCursorKeys()
        this.animator.load(PlayerAnimationKeys.BASE);
        this.animator.play(PlayerAnimationKeys.IDLE_DOWN);
    }

    protected createPhysicsConfig(): Phaser.Types.Physics.Matter.MatterBodyConfig {
        return {
            ...super.createPhysicsConfig(),
            frictionAir: .3,
            mass: 2,
            inverseMass: 1/2,
            label: "player"
        };
    }

    protected safeUpdate(deltaTime: number) {
        super.safeUpdate(deltaTime);
        this.handleMovement(deltaTime);
    }

    private handleMovement(deltaTime: number) {
        const dir = this.getMovementVector().normalize();
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

    private getMovementVector() {
        const right = this.movement.right.isDown;
        const left = this.movement.left.isDown;
        const up = this.movement.up.isDown;
        const down = this.movement.down.isDown;

        const x = right ? 1 : (left ? -1 : 0);
        const y = up ? -1 : (down ? 1 : 0);
        return new Vector2(x, y);
    }

    getRigidBody() {
        return this.rigidbody
    }

}
