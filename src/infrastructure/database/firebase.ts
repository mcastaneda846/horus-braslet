import admin from "firebase-admin";
import fs from "fs";
import path from "path";

let db: admin.firestore.Firestore;

if (!admin.apps.length) {
  try {
    let serviceAccount: admin.ServiceAccount | undefined;

    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    } else {
      const configPath = path.join(process.cwd(), "src/config/horus-64e3b-firebase-adminsdk-fbsvc-06eb372da6.json");
      if (fs.existsSync(configPath)) {
        const fileContent = fs.readFileSync(configPath, "utf8");
        serviceAccount = JSON.parse(fileContent);
      }
    }

    if (serviceAccount) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } else {
      console.warn("No service account credentials found. Initializing with default credentials.");
      admin.initializeApp();
    }
  } catch (error) {
    console.error("Failed to initialize Firebase Admin SDK:", error);
  }
}

try {
  db = admin.firestore();
} catch (error) {
  console.error("Failed to get Firestore instance, creating a dummy placeholder:", error);
  db = {
    collection: () => ({
      doc: () => ({
        get: async () => ({ exists: false, data: () => null }),
        set: async () => {},
        update: async () => {},
      })
    }),
    runTransaction: async (cb: (transaction: unknown) => Promise<unknown>) => cb({
      get: async () => ({ exists: false, data: () => null }),
      set: async () => {},
      update: async () => {},
    })
  } as unknown as admin.firestore.Firestore;
}

export { db, admin };

