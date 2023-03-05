import {BehaviourStateMachine, State, TransitionRule, UpdateRule} from "./BehaviourStateMachine";



export class BehaviourBuilder {


    private states: Map<string, State> = new Map();
    private startState: string = "";

    constructor() {
    }


    registerState(id: string, transitions: Map<TransitionRule, string>, updates: UpdateRule[]) {
        this.states.set(id, {
            id,
            onUpdate: updates,
            transitions
        })
    }

    addState(id: string): StateBuilder {
        return new StateBuilder(id, this);
    }

    setStart(id: string) {
        this.startState = id;
        return this;
    }

    build(): BehaviourStateMachine {
        const start = this.states.get(this.startState);
        if(!start)
            throw new Error("No valid start state specified");

        return new BehaviourStateMachine(this.states, start);
    }

}


class StateBuilder {


    private readonly transitionRules: Map<TransitionRule, string> = new Map();
    private readonly updateRules: UpdateRule[] = [];

    constructor(private readonly id: string,
                private readonly behaviourBuilder: BehaviourBuilder) {
    }

    addTransition(state: string, transition: TransitionRule): StateBuilder {
        this.transitionRules.set(transition, state);
        return this;
    }

    onUpdate(update: UpdateRule): StateBuilder {
        this.updateRules.push(update);
        return this;
    }

    and(): BehaviourBuilder {
        return this.behaviourBuilder;
    }

}
