import "server-only";
import { Storage } from "@google-cloud/storage";
import fs from "fs";
import path from "path";

function createStorage() {
  // 1. Caso Vercel: JSON completo en ENV
  if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
    return new Storage({
      credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY),
      projectId: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY).project_id,
    });
  }

  // 2. Caso local / VM: archivo JSON
  const keyPath =
    process.env.GOOGLE_APPLICATION_CREDENTIALS ||
    path.join(process.cwd(), "secrets", "google-bucket.json");

  if (!fs.existsSync(keyPath)) {
    throw new Error("Google credentials not found");
  }

  return new Storage({
    keyFilename: keyPath,
  });
}

export const storage = createStorage();
