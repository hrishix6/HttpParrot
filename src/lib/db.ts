import { MimeDb, MimeRecord, RequestCollectionModel, RequestModel, TabData } from '@/common/types';

const DB_NAME = 'store';
const DB_VERSION = 8;

enum ObjectStore {
  Collections = 'collections',
  Requests = 'requests',
  History = 'history',
  Mimetypes = 'mimetypes',
  Tabs = 'tabs'
};

export function initDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    let db: IDBDatabase;
    const openReq = indexedDB.open(DB_NAME, DB_VERSION);
    openReq.addEventListener('blocked', (_) => {
      console.log('indexeddb access is blocked');
      reject(new Error('indexdb is blocked'));
    });

    openReq.addEventListener('error', (_) => {
      console.log(`error loading indexdb : ${openReq.error}`);
      reject(openReq.error);
    });

    openReq.addEventListener('upgradeneeded', (_) => {
      console.log("db doesn't exist or version needs update, initializing...");
      db = openReq.result;

      if (!db.objectStoreNames.contains(ObjectStore.History)) {
        db.createObjectStore(ObjectStore.History, { keyPath: 'id' });
        console.log('created history store');
      }

      if (!db.objectStoreNames.contains(ObjectStore.Collections)) {
        db.createObjectStore(ObjectStore.Collections, { keyPath: 'id' });
        console.log('created collections store');
      }

      if (!db.objectStoreNames.contains(ObjectStore.Requests)) {
        db.createObjectStore(ObjectStore.Requests, { keyPath: 'id' });
        console.log('created requests store');
      }

      if (!db.objectStoreNames.contains(ObjectStore.Mimetypes)) {
        db.createObjectStore(ObjectStore.Mimetypes, { keyPath: "id" });
        console.log('created mimetype store');
      }

      if (!db.objectStoreNames.contains(ObjectStore.Tabs)) {
        db.createObjectStore(ObjectStore.Tabs, { keyPath: "id" });
        console.log('created tabs store');
      }
    });

    openReq.addEventListener('success', (_) => {
      console.log('database exists, connected');
      db = openReq.result;
      resolve(db);
    });
  });
}

export async function loadMimedbJson(): Promise<MimeDb> {
  try {
    const res = await fetch("mime-db.json");
    if (res.ok) {
      const json = await res.json();
      return json as MimeDb;
    }

    return {};
  } catch (error) {
    return {};
  }
}

export const defaultTabData = (): TabData => ({
  id: "",
  collectionId: "",
  collectionName: "",
  name: "",
  method: "get",
  url: '',
  query: [],
  headers: [],
  mode: "insert",
  bodyType: "formdata",
  formItems: [],
  enableTextBody: true,
  textBody: "",
  loading: false,
  lock: false,
  responseStatus: "",
  responseSize: "",
  responseTime: "",
  responseBody: "",
  responseBodyType: "unknown",
  responseHeaders: [],
  responseOk: false,
  responseMimetype: "",
  error: false,
  errorMessage: ""
});

interface IRepository {
  setDb: (db: IDBDatabase) => void;
  getStore: (mode: IDBTransactionMode) => IDBObjectStore;
  insert: (dto: any) => Promise<unknown>;
  getAll: (dto: any) => Promise<any[]>;
  deleteAll: () => Promise<unknown>;
  deleteById: (id: string) => Promise<unknown>;
  updateById?: (dto: any) => Promise<unknown>;
}

class CollectionRepository implements IRepository {
  private db: IDBDatabase;
  isInitialized: boolean = false;

  async seed() {
    const existingDefaultCollection = await this.getById('default');

    if (existingDefaultCollection && existingDefaultCollection.id) {
      return;
    }

    const defaultCollection: RequestCollectionModel = {
      id: 'default',
      name: 'Default',
      created: new Date().getTime(),
      variables: []
    };

    try {
      await this.insert(defaultCollection);
      console.log(`successfully added default collection`);
    } catch (error) {
      console.log(`couldn't add default collection`);
    }
  }

  getById(id: string): Promise<RequestCollectionModel> {
    return new Promise((resolve, reject) => {
      const s = this.getStore('readonly');

      const r = s.get(id);

      r.addEventListener('success', () => {
        resolve(r.result);
      });

      r.addEventListener('error', (_) => {
        reject(r.error);
      });
    });
  }

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
      const store = this.getStore('readwrite');

      const r = store.add(dto);

      r.addEventListener('success', () => {
        console.log(`item added to collection ${r.result}`);
        resolve(r.result);
      });

      r.addEventListener('error', (_) => {
        reject(r.error);
      });
    });
  }

  getAll(): Promise<RequestCollectionModel[]> {
    return new Promise((resolve, reject) => {
      const store = this.getStore('readonly');

      const r = store.getAll();

      r.addEventListener('success', (_) => {
        resolve(r.result);
      });

      r.addEventListener('error', () => {
        reject(r.error);
      });
    });
  }

  deleteAll() {
    return new Promise((resolve, reject) => {
      const collectionStore = this.getStore('readwrite');
      const r = collectionStore.clear();
      r.addEventListener('error', () => reject(r.error));

      r.addEventListener('success', () => resolve(r.result));
    });
  }

  deleteAllRequests() {
    return new Promise((resolve, reject) => {
      const reqStore = this.getStore('readwrite');
      const r = reqStore.clear();
      r.addEventListener('error', () => reject(r.error));

      r.addEventListener('success', () => resolve(r.result));
    });
  }

  deleteById(id: string) {
    return new Promise((resolve, reject) => {
      const store = this.getStore('readwrite');
      const r = store.delete(id);
      r.addEventListener('error', () => reject(r.error));

      r.addEventListener('success', () => resolve(r.result));
    });
  }

  updateById(dto: RequestCollectionModel) {
    return new Promise((resolve, reject) => {
      const store = this.getStore('readwrite');
      const r = store.put(dto);
      r.addEventListener('error', () => reject(r.error));

      r.addEventListener('success', () => resolve(r.result));
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
      const store = this.getStore('readwrite');

      const r = store.add(dto);

      r.addEventListener('success', () => {
        console.log(`item added to request history ${r.result}`);
        resolve(r.result);
      });

      r.addEventListener('error', (_) => {
        reject(r.error);
      });
    });
  }

  getAll(): Promise<RequestModel[]> {
    return new Promise((resolve, reject) => {
      const store = this.getStore('readonly');

      const r = store.getAll();

      r.addEventListener('success', (_) => {
        resolve(r.result);
      });

      r.addEventListener('error', () => {
        reject(r.error);
      });
    });
  }

  deleteAll() {
    return new Promise((resolve, reject) => {
      const store = this.getStore('readwrite');
      const r = store.clear();

      r.addEventListener('error', () => reject(r.error));

      r.addEventListener('success', () => resolve(r.result));
    });
  }

  deleteById(id: string) {
    return new Promise((resolve, reject) => {
      const store = this.getStore('readwrite');
      const r = store.delete(id);
      r.addEventListener('error', () => reject(r.error));

      r.addEventListener('success', () => resolve(r.result));
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
      const store = this.getStore('readwrite');

      const r = store.add(dto);

      r.addEventListener('success', () => {
        console.log(`item added to requests ${r.result}`);
        resolve(r.result);
      });

      r.addEventListener('error', (_) => {
        reject(r.error);
      });
    });
  }
  insertMany(dto: RequestModel[]) {
    return new Promise((resolve, reject) => {
      const t = this.db.transaction(ObjectStore.Requests, "readwrite");

      const stroe = t.objectStore(ObjectStore.Requests);

      for (let item of dto) {
        stroe.add(item);
      }

      t.addEventListener("complete", () => {
        resolve(true);
      });

      t.addEventListener("error", () => {
        reject(false);
      })
    });
  }

  getAll(): Promise<RequestModel[]> {
    return new Promise((resolve, reject) => {
      const store = this.getStore('readonly');

      const r = store.getAll();

      r.addEventListener('success', (_) => {
        resolve(r.result);
      });

      r.addEventListener('error', () => {
        reject(r.error);
      });
    });
  }

  deleteAll() {
    return new Promise((resolve, reject) => {
      const store = this.getStore('readwrite');
      const r = store.clear();
      r.addEventListener('error', () => reject(r.error));

      r.addEventListener('success', () => resolve(r.result));
    });
  }

  deleteById(id: string) {
    return new Promise((resolve, reject) => {
      const store = this.getStore('readwrite');
      const r = store.delete(id);
      r.addEventListener('error', () => reject(r.error));

      r.addEventListener('success', () => resolve(r.result));
    });
  }

  updateById(dto: RequestModel) {
    return new Promise((resolve, reject) => {
      const store = this.getStore('readwrite');
      const r = store.put(dto);
      r.addEventListener('error', () => reject(r.error));

      r.addEventListener('success', () => resolve(r.result));
    });
  }

  deleteMultiple(ids: string[]) {
    return new Promise((resolve, reject) => {
      const t = this.db.transaction(ObjectStore.Requests, "readwrite");
      const store = t.objectStore(ObjectStore.Requests);
      console.log(`deleting ids -> ${ids.join('\n')}`);
      for (let id of ids) {
        store.delete(id);
      }

      t.addEventListener("complete", () => resolve(true));
      t.addEventListener("error", () => reject(false));
    });
  }
}

export const requestRepo = new RequestsRepository();


class MimetypesRepository {
  private db: IDBDatabase;
  isInitialized: boolean = false;

  setDb(db: IDBDatabase) {
    this.db = db;
    this.isInitialized = true;
  }

  getStore(mode: IDBTransactionMode) {
    const tx = this.db.transaction(ObjectStore.Mimetypes, mode);
    return tx.objectStore(ObjectStore.Mimetypes);
  }

  async init(): Promise<boolean> {
    try {
      const count = await this.checkLoaded();
      if (count) {
        return true;
      }
      const mimeDb = await loadMimedbJson();
      await this.seed(mimeDb);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  seed(jsonData: MimeDb): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const keys = Object.keys(jsonData);
      if (!keys.length) {
        resolve(true);
        return;
      }

      const tx = this.db.transaction(ObjectStore.Mimetypes, "readwrite");
      const store = tx.objectStore(ObjectStore.Mimetypes);
      let record: Partial<MimeRecord> = {};
      for (let key of keys) {
        record.id = key;
        record.compressible = jsonData[key].compressible;
        record.extensions = jsonData[key].extensions || ["unknown"];
        store.add(record);
      }

      tx.addEventListener("complete", () => {
        console.log(`loaded records successfully`);
        resolve(true);
      });

      tx.addEventListener("error", () => {
        console.log(`failed to load records`);
        reject();
      });

    });
  }

  getById(id: string): Promise<MimeRecord> {
    return new Promise((resolve, reject) => {
      const s = this.getStore('readonly');

      const r = s.get(id);

      r.addEventListener('success', () => {
        resolve(r.result);
      });

      r.addEventListener('error', (_) => {
        reject(r.error);
      });
    });
  }

  checkLoaded(): Promise<number> {
    return new Promise((resolve, reject) => {
      const store = this.getStore("readonly");

      const req = store.count();

      req.addEventListener("success", () => {
        resolve(req.result as number);
      });

      req.addEventListener("error", () => {
        reject(req.error);
      });
    });
  }

}

export const mimeRepo = new MimetypesRepository();

export interface TabModel {
  id: string;
  name: string;
  data: TabData
}

export interface UpdateTabModel {
  id: string;
  name?: string;
  data: Partial<TabData>
}

class TabsRepository {
  private db: IDBDatabase;
  isInitialized: boolean = false;

  setDb(db: IDBDatabase) {
    this.db = db;
    this.isInitialized = true;
  }

  checkIfExists(id: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const store = this.getStore("readonly");
      const req = store.getKey(id);

      req.addEventListener("success", (_) => {
        resolve(!!req.result);
      });
      req.addEventListener("error", (_) => reject(false));
    })
  }

  getStore(mode: IDBTransactionMode) {
    const tx = this.db.transaction(ObjectStore.Tabs, mode);
    return tx.objectStore(ObjectStore.Tabs);
  }

  getAll(): Promise<TabModel[]> {
    return new Promise((resolve, reject) => {

      const store = this.getStore("readonly");
      const req = store.getAll();

      req.addEventListener("success", (_) => resolve(req.result));
      req.addEventListener("error", (_) => reject(req.error));
    });
  }

  insert(dto: TabModel): Promise<string> {
    return new Promise((resolve, reject) => {
      console.log(`trying to insert new tab..`);
      const store = this.getStore("readwrite");
      const req = store.add(dto);
      req.addEventListener("success", (_) => resolve(req.result as string));
      req.addEventListener("error", (_) => reject(req.error));
    });
  }

  update(dto: UpdateTabModel): Promise<string> {
    return new Promise((resolve, reject) => {
      console.log(`trying to upsert new tab..`);
      const store = this.getStore("readwrite");
      const req = store.put(dto);
      req.addEventListener("success", (_) => resolve(req.result as string));
      req.addEventListener("error", (_) => reject(req.error));
    });
  }

  delete(id: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const store = this.getStore("readwrite");
      const req = store.delete(id);
      req.addEventListener("success", (_) => resolve(""));
      req.addEventListener("error", (_) => reject(req.error));
    });
  }

}

export const tabRepo = new TabsRepository();


export async function updateTabDataInDB(model: UpdateTabModel, __: string) {
  try {
    const et = await tabRepo.checkIfExists(model.id);
    if (et) {
      await tabRepo.update(model);
    }
  } catch (error) {
    console.log(`couldn't update tab to db ${error}`);
  }
}