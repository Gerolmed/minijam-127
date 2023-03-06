export class CooldownManager {


    private lastUsed: Map<string, number> = new Map();

    constructor(private readonly cooldownMap: Map<string, number>) {
        for (let key of this.cooldownMap.keys()) {
            this.lastUsed.set(key, 0);
        }
    }

    has(ability: string): boolean {
        const dateLastUsed = this.lastUsed.get(ability)!;
        return (Date.now() - dateLastUsed) > this.cooldownMap.get(ability)!;
    }

    use(ability: string) {
        this.lastUsed.set(ability, Date.now());
    }

}
