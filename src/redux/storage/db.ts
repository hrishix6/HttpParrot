import { RequestModel } from "../../types";

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

export class Database {

    protected readonly db: IDBDatabase;

    constructor(db: IDBDatabase) {
        this.db = db;
    }
}


export class CollectionDatabase extends Database {
    constructor(db: IDBDatabase) {
        super(db);
    }



}

export class HistoryDatabase extends Database {
    constructor(db: IDBDatabase) {
        super(db);
    }

    insert(dto: RequestModel) {
        return new Promise((resolve, reject) => {
            const t = this.db.transaction("history", "readwrite");

            const c = t.objectStore("history");

            const r = c.add(dto);

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

            const t = this.db.transaction("history", "readonly");
            const c = t.objectStore("history");

            const r = c.getAll();

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

            const t = this.db.transaction("history", "readwrite");
            const c = t.objectStore("history");
            const r = c.clear();

            r.addEventListener("error", () => reject(r.error));

            r.addEventListener("success", () => resolve(r.result));
        });
    }

    deleteById(id: string) {
        return new Promise((resolve, reject) => {

            const t = this.db.transaction("history", "readwrite");
            const c = t.objectStore("history");
            const r = c.delete(id);
            r.addEventListener("error", () => reject(r.error));

            r.addEventListener("success", () => resolve(r.result));
        });
    }

}