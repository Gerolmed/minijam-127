import {BehaviourStateMachine, State, TransitionRule, UpdateRule} from "./BehaviourStateMachine";



export class BehaviourBuilder<T> {


    private states: Map<string, State<T>> = new Map();
    private startState: string = "";

    private dataProvider?: () => T;

    constructor() {
    }


    registerState(id: string, transitions: Map<TransitionRule<T>, string>, updates: UpdateRule<T>[]) {
        this.states.set(id, {
            id,
            onUpdate: updates,
            transitions
        })
    }

    addState(id: string): StateBuilder<T> {
        return new StateBuilder(id, this);
    }

    setStart(id: string) {
        this.startState = id;
        return this;
    }

    setDataProvider(dataProvider: () => T): BehaviourBuilder<T> {
        this.dataProvider = dataProvider;
        return this;
    }

    build(): BehaviourStateMachine<T> {
        const start = this.states.get(this.startState);
        if(!start)
            throw new Error("No valid start state specified");

        if(!this.dataProvider)
            throw new Error("No valid data provider specified")

        return new BehaviourStateMachine<T>(this.states, start, this.dataProvider);
    }

}


class StateBuilder<T> {


    private readonly transitionRules: Map<TransitionRule<T>, string> = new Map();
    private readonly updateRules: UpdateRule<T>[] = [];

    constructor(private readonly id: string,
                private readonly behaviourBuilder: BehaviourBuilder<T>) {
    }

    addTransition(state: string, transition: TransitionRule<T>): StateBuilder<T> {
        this.transitionRules.set(transition, state);
        return this;
    }

    onUpdate(update: UpdateRule<T>): StateBuilder<T> {
        this.updateRules.push(update);
        return this;
    }

    and(): BehaviourBuilder<T> {
        return this.behaviourBuilder;
    }

}
