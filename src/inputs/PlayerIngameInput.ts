import {Scene} from "phaser";
import {DoubleAxisInput} from "./DoubleAxisInput";
import SHIFT = Phaser.Input.Keyboard.KeyCodes.SHIFT;


export class PlayerIngameInput {

    private combatDirection!: DoubleAxisInput;
    private movement!: DoubleAxisInput


    constructor(scene: Scene, doDash: () => void) {

        const keyboard = scene.input.keyboard!;
        this.combatDirection = new DoubleAxisInput(keyboard.createCursorKeys(), true)

        this.movement = new DoubleAxisInput({
            up: keyboard.addKey("w"),
            down: keyboard.addKey("s"),
            left: keyboard.addKey("a"),
            right: keyboard.addKey("d"),
        })

        keyboard.addKey(SHIFT).on("down", doDash)
    }


    update(deltaTime: number) {
        this.movement.update(deltaTime)
    }


    public getMovementVectorRaw() {
        return this.movement.getVectorRaw();
    }

    public getMovementVector() {
        return this.movement.getVector();
    }

    public getCombatVectorRaw() {
        return this.combatDirection.getVectorRaw();
    }

}
