import Key = Phaser.Input.Keyboard.Key;
import Vector2 = Phaser.Math.Vector2;

export class DoubleAxisInput {

    private prioRight = false;
    private prioUp = false;


    constructor(
        private directions: {
            up: Key,
            down: Key,
            left: Key,
            right: Key,
        }
    ) {
        // Detect input key down
        directions.up.on("down", () => this.prioUp = true)
        directions.down.on("down", () => this.prioUp = false)

        directions.right.on("down", () => this.prioRight = true)
        directions.left.on("down", () => this.prioRight = false)
    }


    public update(deltaTime: number) {

    }


    public getVectorRaw() {

        const right = this.directions.right.isDown;
        const left = this.directions.left.isDown;
        const up = this.directions.up.isDown;
        const down = this.directions.down.isDown;

        let x: number;

        if(this.prioRight) {
            x = right ? 1 : (left ? -1 : 0);
        } else {
            x = left ? -1 : (right ? 1 : 0);
        }

        let y: number;

        if(this.prioUp) {
            y = up ? -1 : (down ? 1 : 0);
        } else {
            y = down ? 1 : (up ? -1 : 0);
        }

        return new Vector2(x, y);
    }

    public getVector() {
        return this.getVectorRaw().normalize();
    }
}
