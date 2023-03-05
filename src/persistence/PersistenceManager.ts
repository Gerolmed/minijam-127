import {ValueStore} from "./ValueStore";


const DATABASE_NAME = "SplatCatDB";
const MAIN_KEY_STORE = "MainKeyStore";

export class PersistenceManager {

    private valueStore?: ValueStore;
    private db?: IDBDatabase;

    private constructor() {

    }

     async connect() {
        const request = window.indexedDB.open(DATABASE_NAME, 3);

        try {
            this.db = await this.login(request);
        } catch (e) {
            console.error(e);
        }
    }

    async set(id: string, value: any, targetStore: string = MAIN_KEY_STORE) {
        if(!(this.db))
            throw new Error("Indexeddb not initialized")

        const object = {id, value};

        const transaction = this.db.transaction(targetStore, "readwrite");
        const store = transaction.objectStore(targetStore);

        const request = store.put(object);

        return new Promise<any>((resolve, reject) => {
            request.onsuccess = resolve;
            request.onerror = reject;
        })
    }

    async get(id: string, targetStore: string = MAIN_KEY_STORE) {
        if(!(this.db))
            throw new Error("Indexeddb not initialized")

        const transaction = this.db.transaction(targetStore, "readonly");
        const store = transaction.objectStore(targetStore);
        const request = store.get(IDBKeyRange.only(id));

        return new Promise((resolve, reject) => {
            request.onsuccess = () => {
                if(!request.result) {
                    reject("Unknown key");
                    return;
                }
                resolve(request.result["value"]);
            }
            request.onerror = reject;
        })
    }

    private login(req: IDBOpenDBRequest): Promise<IDBDatabase> {
        return new Promise((resolve, reject) => {
            req.onerror = () => reject(req.error);
            req.onsuccess = () => resolve(req.result);

            req.onupgradeneeded = (event) => {
                const db = req.result.createObjectStore(MAIN_KEY_STORE, {keyPath: "id"});
            }
        })
    }


    private static persistenceManager?: PersistenceManager = undefined
    static get(): PersistenceManager {
        if(this.persistenceManager === undefined)
            this.persistenceManager = new PersistenceManager();

        return this.persistenceManager;
    }

}
