import admin from "firebase-admin";

let db: admin.firestore.Firestore;

if (!admin.apps.length) {
  try {
    const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
    if (!raw) throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON env var not set");
    const serviceAccount = JSON.parse(raw) as admin.ServiceAccount;
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
  } catch (error) {
    console.error("Failed to initialize Firebase Admin SDK:", error);
  }
}

try {
  db = admin.firestore();
} catch (error) {
  console.error("Failed to get Firestore instance, creating a dummy placeholder:", error);
  const emptySnap = { docs: [], empty: true, size: 0 };
  const emptyDocSnap = { exists: false, data: () => null };
  // Recursive dummy that supports .collection().doc().collection()... chains
  const makeCollection = (): object => ({
    doc: () => makeDoc(),
    orderBy: () => makeCollection(),
    limit: () => makeCollection(),
    get: async () => emptySnap,
    add: async () => ({ id: "dummy" }),
  });
  const makeDoc = (): object => ({
    get: async () => emptyDocSnap,
    set: async () => {},
    update: async () => {},
    collection: () => makeCollection(),
  });
  db = {
    collection: () => makeCollection(),
    runTransaction: async (cb: (transaction: unknown) => Promise<unknown>) => cb({
      get: async () => emptyDocSnap,
      set: () => {},
      update: () => {},
    }),
  } as unknown as admin.firestore.Firestore;
}

export { db, admin };

