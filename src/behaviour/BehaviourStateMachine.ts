export type TransitionRule = () => boolean;
export type UpdateRule = () => void;


export type State = {
    id: string,
    onUpdate: UpdateRule[],
    transitions: Map<TransitionRule, string>
}

export class BehaviourStateMachine {

    private current: State;

    constructor(private readonly states: Map<string, State>, private start: State) {
        this.current = start;
    }

    update() {
        for (const rule of this.current.transitions.keys()) {
            if(!rule())
                continue;

            this.current = this.states.get(this.current.transitions.get(rule)!)!;
        }

        this.current.onUpdate.forEach(update => update())
    }

}
