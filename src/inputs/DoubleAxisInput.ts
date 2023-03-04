import Key = Phaser.Input.Keyboard.Key;
import Vector2 = Phaser.Math.Vector2;

export class DoubleAxisInput {

    private prioRight = false;
    private prioUp = false;
    private prioX = false;


    constructor(
        private readonly directions: {
            up: Key,
            down: Key,
            left: Key,
            right: Key,
        },
        private readonly singleDir = false,
    ) {
        // Detect input key down
        directions.up.on("down", () => {
            this.prioUp = true;
            this.prioX = false;
        })
        directions.down.on("down", () => {
            this.prioUp = false;
            this.prioX = false;
        })

        directions.right.on("down", () => {
            this.prioRight = true;
            this.prioX = true;
        })
        directions.left.on("down", () => {
            this.prioRight = false;
            this.prioX = true;
        })
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

        if(this.singleDir) {
            if(this.prioX && x !== 0) y = 0;
            if(!this.prioX && y !== 0) x = 0;
        }


        return new Vector2(x, y);
    }

    public getVector() {
        return this.getVectorRaw().normalize();
    }
}
