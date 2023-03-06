import {BehaviourBuilder} from "./BehaviourBuilder";

export interface IStateBuilderConfigurer<T> {
    configure(builder: BehaviourBuilder<T>): void;
}
