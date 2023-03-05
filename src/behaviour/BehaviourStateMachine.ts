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

        console.log(this.current.id)

        for (const rule of this.globalTransition.keys()) {
            this.current = this.states.get(this.globalTransition.get(rule)!)!;
        }

        for (const rule of this.current.transitions.keys()) {
            if(!rule(data, deltaTime))
                continue;

            this.current = this.states.get(this.current.transitions.get(rule)!)!;
        }

        this.current.onUpdate.forEach(update => update(data, deltaTime))
    }

}
