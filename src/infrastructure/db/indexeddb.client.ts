const DB_NAME    = "horus-first-aid";
const DB_VERSION = 1;
const STORE_NAME = "protocols";

export function openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
            const db    = (event.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
                store.createIndex("category", "category", { unique: false });
                store.createIndex("severity", "severity", { unique: false });
            }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror   = () => reject(request.error);
    });
}

// Operaciones genéricas
export async function dbGetAll<T>(storeName: string): Promise<T[]> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx      = db.transaction(storeName, "readonly");
        const store   = tx.objectStore(storeName);
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror   = () => reject(request.error);
    });
}

export async function dbGetById<T>(storeName: string, id: string): Promise<T | null> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx      = db.transaction(storeName, "readonly");
        const store   = tx.objectStore(storeName);
        const request = store.get(id);
        request.onsuccess = () => resolve(request.result ?? null);
        request.onerror   = () => reject(request.error);
    });
}

export async function dbPutMany<T>(storeName: string, items: T[]): Promise<void> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx    = db.transaction(storeName, "readwrite");
        const store = tx.objectStore(storeName);
        items.forEach((item) => store.put(item));
        tx.oncomplete = () => resolve();
        tx.onerror    = () => reject(tx.error);
    });
}

export async function dbCount(storeName: string): Promise<number> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx      = db.transaction(storeName, "readonly");
        const store   = tx.objectStore(storeName);
        const request = store.count();
        request.onsuccess = () => resolve(request.result);
        request.onerror   = () => reject(request.error);
    });
}

export async function dbGetByIndex<T>(
    storeName: string,
    indexName: string,
    value: string
): Promise<T[]> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx      = db.transaction(storeName, "readonly");
        const store   = tx.objectStore(storeName);
        const index   = store.index(indexName);
        const request = index.getAll(value);
        request.onsuccess = () => resolve(request.result);
        request.onerror   = () => reject(request.error);
    });
}