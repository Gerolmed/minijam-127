import {PersistenceManager} from "../persistence/PersistenceManager";


type WorldStore = {
    ratKingKilled: boolean
    opportunisticOpossumKilled: boolean,
    spawnPosition: {x: number, y: number},
    masterVolume: number,
    raw: {
        [key: string]: any
    }
}

export class WorldStoreManager {


    private readonly persistenceManager: PersistenceManager;

    private store!: WorldStore

    private constructor() {
        this.persistenceManager = PersistenceManager.get();
    }

    getStore(): WorldStore {
        return this.store!;
    }


    private async load() {
        try {
            this.store = await this.persistenceManager.get("save") as WorldStore;
        } catch (e) {
            this.store = this.createEmptySave();
        }
    }

    async write() {
        await this.persistenceManager.set("save", this.store);
    }

    private createEmptySave(): WorldStore {
        return {
            ratKingKilled: false,
            opportunisticOpossumKilled: false,
            spawnPosition: {x: 257, y: 130},
            masterVolume: 0.5,
            raw: {}
        }
    }

    private static worldSave?: WorldStoreManager;
    static async loadFromDatabase() {
        if(this.worldSave)
            return

        this.worldSave = new WorldStoreManager();
        await this.worldSave.load();
    }

    static get() {
        return this.worldSave!;
    }

}
