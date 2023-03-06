export type TransitionRule<T> = (data: T, deltaTime: number) => boolean;
export type UpdateRule<T> = (data: T, deltaTime: number) => void;


export type State<T> = {
    id: string,
    onUpdate: UpdateRule<T>[],
    transitions: Map<TransitionRule<T>, string>
}

export class BehaviourStateMachine<T> {

    private current: State<T>;

    constructor(private readonly states: Map<string, State<T>>,
                private readonly globalTransition: Map<TransitionRule<T>, string>,
                private readonly start: State<T>,
                private readonly dataProvider: () => T) {
        this.current = start;
    }

    update(deltaTime: number) {
        const data = this.dataProvider();

        for (const rule of this.globalTransition.keys()) {
            if(!rule(data, deltaTime))
                continue;

            const to = this.globalTransition.get(rule);
            if (!to) throw new Error(`Missing global rule`)
            const toState = this.states.get(to!);
            if (!toState) throw new Error(`Missing state for ID ${to} of global transition`)
            this.current = toState;
        }

        for (const rule of this.current.transitions.keys()) {
            if(!rule(data, deltaTime))
                continue;
            const to = this.current.transitions.get(rule);
            if (!to) throw new Error(`Missing target for rule of ${this.current.id}`)
            const toState = this.states.get(to!);
            if (!toState) throw new Error(`Missing state for ID ${to} of transition state ${this.current.id}`)
            this.current = toState;

        }

        this.current.onUpdate.forEach(update => update(data, deltaTime))
    }

}
