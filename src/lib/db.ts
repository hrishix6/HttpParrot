import { RequestCollectionModel, RequestModel } from "@/common/types";

const DB_NAME = 'store';
const DB_VERSION = 4;

enum ObjectStore {
    Collections = 'collections',
    Requests = 'requests',
    History = 'history'
}

export function initDatabase(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        let db: IDBDatabase;
        const openReq = indexedDB.open(DB_NAME, DB_VERSION);

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
            console.log("db doesn't exist or version needs update, initializing...");
            db = openReq.result;

            if (db.objectStoreNames.contains(ObjectStore.History)) {
                db.deleteObjectStore("history");
                console.log(`deleted previous history store`);
            }

            if (db.objectStoreNames.contains(ObjectStore.Collections)) {
                db.deleteObjectStore("collections");
                console.log(`deleted previous collections store`);
            }

            if (db.objectStoreNames.contains(ObjectStore.Requests)) {
                db.deleteObjectStore("requests");
                console.log(`deleted previous requests store`);
            }

            db.createObjectStore(ObjectStore.History, { keyPath: "id" });
            console.log("created history store");

            db.createObjectStore(ObjectStore.Requests, { keyPath: "id" });
            console.log("created requests store");

            db.createObjectStore(ObjectStore.Collections, { keyPath: "id" });
            console.log("created collections store");

            resolve(db);
        });
    });
}

interface IRepository {
    setDb: (db: IDBDatabase) => void,
    getStore: (mode: IDBTransactionMode) => IDBObjectStore,
    insert: (dto: any) => Promise<unknown>,
    getAll: (dto: any) => Promise<any[]>,
    deleteAll: () => Promise<unknown>,
    deleteById: (id: string) => Promise<unknown>,
    updateById?: (dto: any) => Promise<unknown>,
}

class CollectionRepository implements IRepository {
    private db: IDBDatabase;
    isInitialized: boolean = false;
    setDb(db: IDBDatabase) {
        this.db = db;
        this.isInitialized = true;
    }

    getStore(mode: IDBTransactionMode) {
        const t = this.db.transaction(ObjectStore.Collections, mode);
        return t.objectStore(ObjectStore.Collections);
    }

    insert(dto: RequestCollectionModel) {
        return new Promise((resolve, reject) => {
            const store = this.getStore("readwrite");

            const r = store.add(dto);

            r.addEventListener("success", () => {
                console.log(`item added to collection ${r.result}`);
                resolve(r.result);
            });

            r.addEventListener("error", (_) => {
                reject(r.error);
            });

        });
    }

    getAll(): Promise<RequestCollectionModel[]> {
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
            const collectionStore = this.getStore("readwrite");
            const r = collectionStore.clear();
            r.addEventListener("error", () => reject(r.error));

            r.addEventListener("success", () => resolve(r.result));
        });
    }

    deleteAllRequests() {
        return new Promise((resolve, reject) => {
            const reqStore = this.getStore("readwrite");
            const r = reqStore.clear();
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
export const collectionRepo = new CollectionRepository();

class HistoryRepository implements IRepository {

    private db: IDBDatabase;
    isInitialized: boolean = false;

    getStore(mode: IDBTransactionMode) {
        const t = this.db.transaction(ObjectStore.History, mode);
        return t.objectStore(ObjectStore.History);
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
export const historyRepo = new HistoryRepository();

class RequestsRepository implements IRepository {
    private db: IDBDatabase;
    isInitialized: boolean = false;
    setDb(db: IDBDatabase) {
        this.db = db;
        this.isInitialized = true;
    }

    getStore(mode: IDBTransactionMode) {
        const t = this.db.transaction(ObjectStore.Requests, mode);
        return t.objectStore(ObjectStore.Requests);
    }

    insert(dto: RequestModel) {
        return new Promise((resolve, reject) => {
            const store = this.getStore("readwrite");

            const r = store.add(dto);

            r.addEventListener("success", () => {
                console.log(`item added to requests ${r.result}`);
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

    deleteMultiple(ids: string[]) {
        return new Promise((resolve, reject) => {
            const s = this.getStore("readwrite");
            const r = s.delete(ids);
            r.addEventListener("error", () => reject(r.error));
            r.addEventListener("success", () => resolve(r.result));
        });
    }

}

export const requestRepo = new RequestsRepository();