import {LivingEntity} from "./LivingEntity";
import CursorKeys = Phaser.Types.Input.Keyboard.CursorKeys;
import Key = Phaser.Input.Keyboard.Key;
import Vector2 = Phaser.Math.Vector2;

export class Player extends LivingEntity {

    private arrow!: CursorKeys;
    private speed = 5;
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
    }

    protected safeUpdate(deltaTime: number) {
        super.safeUpdate(deltaTime);
        this.handleMovement(deltaTime);
    }

    private handleMovement(deltaTime: number) {
        const {x,y} = this.getMovementVector()
        this.scene.matter.setVelocity(this.rigidbody, x * this.speed, y * this.speed);
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
}
