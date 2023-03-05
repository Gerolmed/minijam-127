import {WorldStoreManager} from "../world/WorldSave";

type HintJson = {
    pre_boss_1: string[],
    pre_boss_2: string[],
    end_boss: string[],
}


function getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
}

class DialogData {
    private hints!: HintJson;

    getRandomCurrent(): string {
        const list = this.hints[this.getPhase()];
        return list[getRandomInt(list.length)]
    }

    load(json: HintJson) {
        this.hints = json;
    }

    private getPhase() {
        if(!WorldStoreManager.get().getStore().ratKingKilled) {
            return "pre_boss_1"
        }

        if(!WorldStoreManager.get().getStore().opportunisticOpossumKilled) {
            return "pre_boss_2"
        }
        return "end_boss";
    }
}

export let GLOBAL_DIALOG_DATA = new DialogData();
