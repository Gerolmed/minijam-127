import {Enemy, EnemyAiParams} from "../Enemy";
import {BehaviourBuilder, StateBuilder} from "../../../../behaviour/BehaviourBuilder";
import {IStateBuilderConfigurer} from "../../../../behaviour/IStateBuilderConfigurer";

export abstract class AttackStateBuilder implements IStateBuilderConfigurer<EnemyAiParams>{
    protected constructor(
        public readonly id: string,
        protected readonly enemy: Enemy,
    ) {
    }


    configure(builder: BehaviourBuilder<EnemyAiParams>) {
        const state = builder.addState(this.id);
        this.doSetup(state);
        state.and()
    }

    protected abstract doSetup(stateBuilder: StateBuilder<EnemyAiParams>): void;
}
