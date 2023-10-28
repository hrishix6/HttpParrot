import { RequestModel } from "@/common/types";

export function initDatabase(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        let db: IDBDatabase;
        const openReq = indexedDB.open("store", 1);

        openReq.addEventListener("success", (_) => {
            console.log('database exists, connected');
            db = openReq.result;
            resolve(db);
        });

        openReq.addEventListener("blocked", (_) => {
            console.log("indexeddb access is blocked");
            reject(new Error("indexdb is blocked"));
        });

        openReq.addEventListener("error", (_) => {
            console.log(`error loading indexdb : ${openReq.error}`);
            reject(openReq.error);
        });

        openReq.addEventListener("upgradeneeded", (_) => {
            console.log("db doesn't exist, initializing...");
            db = openReq.result;

            if (!db.objectStoreNames.contains("history")) {
                db.createObjectStore("history", { keyPath: "id" });
                console.log("created history store");
            }

            if (!db.objectStoreNames.contains("collection")) {
                db.createObjectStore("collection", { keyPath: "id" });
                console.log("created collection store");
            }
            resolve(db);
        });
    });
}

class CollectionDatabase {
    private db: IDBDatabase;
    isInitialized: boolean = false;
    setDb(db: IDBDatabase) {
        this.db = db;
        this.isInitialized = true;
    }

    private getStore(mode: IDBTransactionMode) {
        const t = this.db.transaction("collection", mode);
        return t.objectStore("collection");
    }

    insert(dto: RequestModel) {
        return new Promise((resolve, reject) => {
            const store = this.getStore("readwrite");

            const r = store.add(dto);

            r.addEventListener("success", () => {
                console.log(`item added to request collection ${r.result}`);
                resolve(r.result);
            });

            r.addEventListener("error", (_) => {
                reject(r.error);
            });

        });
    }

    getAll(): Promise<RequestModel[]> {
        return new Promise((resolve, reject) => {

            const store = this.getStore("readonly");

            const r = store.getAll();

            r.addEventListener("success", (_) => {
                resolve(r.result);
            });

            r.addEventListener("error", () => {
                reject(r.error);
            });

        });
    }

    deleteAll() {
        return new Promise((resolve, reject) => {
            const store = this.getStore("readwrite");
            const r = store.clear();
            r.addEventListener("error", () => reject(r.error));

            r.addEventListener("success", () => resolve(r.result));
        });
    }

    deleteById(id: string) {
        return new Promise((resolve, reject) => {
            const store = this.getStore('readwrite');
            const r = store.delete(id);
            r.addEventListener("error", () => reject(r.error));

            r.addEventListener("success", () => resolve(r.result));
        });
    }

    updateById(dto: RequestModel) {
        return new Promise((resolve, reject) => {
            const store = this.getStore('readwrite');
            const r = store.put(dto);
            r.addEventListener("error", () => reject(r.error));

            r.addEventListener("success", () => resolve(r.result));
        });
    }

}
export const collectionDB = new CollectionDatabase();

class HistoryDatabase {

    private db: IDBDatabase;
    isInitialized: boolean = false;

    private getStore(mode: IDBTransactionMode) {
        const t = this.db.transaction("history", mode);
        return t.objectStore("history");
    }


    setDb(db: IDBDatabase) {
        this.db = db;
        this.isInitialized = true;
    }

    insert(dto: RequestModel) {
        return new Promise((resolve, reject) => {
            const store = this.getStore("readwrite");

            const r = store.add(dto);

            r.addEventListener("success", () => {
                console.log(`item added to request history ${r.result}`);
                resolve(r.result);
            });

            r.addEventListener("error", (_) => {
                reject(r.error);
            });

        });
    }

    getAll(): Promise<RequestModel[]> {
        return new Promise((resolve, reject) => {

            const store = this.getStore("readonly");

            const r = store.getAll();

            r.addEventListener("success", (_) => {
                resolve(r.result);
            });

            r.addEventListener("error", () => {
                reject(r.error);
            });

        });
    }

    deleteAll() {
        return new Promise((resolve, reject) => {

            const store = this.getStore("readwrite");
            const r = store.clear();

            r.addEventListener("error", () => reject(r.error));

            r.addEventListener("success", () => resolve(r.result));
        });
    }

    deleteById(id: string) {
        return new Promise((resolve, reject) => {
            const store = this.getStore("readwrite");
            const r = store.delete(id);
            r.addEventListener("error", () => reject(r.error));

            r.addEventListener("success", () => resolve(r.result));
        });
    }

}
export const historyDb = new HistoryDatabase();
