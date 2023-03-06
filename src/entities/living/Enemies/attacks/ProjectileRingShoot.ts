import {Enemy, EnemyAiParams} from "../Enemy";
import {BehaviourBuilder, StateBuilder} from "../../../../behaviour/BehaviourBuilder";
import {AttackStateBuilder} from "./AttackStateBuilder";

export class ProjectileRingShoot extends AttackStateBuilder{
    constructor(
        enemy: Enemy,
        id = "projectile_ring_shoot",
    ) {
        super(id, enemy)
    }


    configure(builder: BehaviourBuilder<EnemyAiParams>) {
        builder.addState("projectile_ring_shoot")
    }

    protected doSetup(stateBuilder: StateBuilder<EnemyAiParams>): void {
        stateBuilder.onUpdate((data, deltaTime) => this.update(data, deltaTime))
    }

    private update(data: EnemyAiParams, deltaTime: number) {

    }
}
