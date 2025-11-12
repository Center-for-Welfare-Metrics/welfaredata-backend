import { Storage } from "@google-cloud/storage";
import path from "path";

const uid = require("uid-safe");

const storage = new Storage({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
});

const bucket = storage.bucket(
  process.env.GOOGLE_CLOUD_BUCKET_NAME || "danger-zone"
);

const encode = (data: any) => {
  let buffer = Buffer.from(data);
  let base64 = buffer.toString("base64");
  return base64;
};

export const upload = async (
  originalName: string,
  fileContent: Buffer | string,
  contentType: string,
  prefix: string = ""
): Promise<{ Location: string; Key: string; Bucket: string }> => {
  let ext = path.extname(originalName);
  let fileName = `${prefix}_${uid.sync(18)}${ext}`;

  const file = bucket.file(fileName);

  await file.save(fileContent, {
    metadata: {
      contentType: contentType,
    },
  });

  return {
    Location: `https://storage.googleapis.com/${bucket.name}/${fileName}`,
    Key: fileName,
    Bucket: bucket.name,
  };
};

export const download = (disk: string, file_name: string) => {
  return new Promise((resolve, reject) => {
    let key = `${disk}${file_name}`;
    const file = bucket.file(key);

    file
      .download()
      .then(([contents]) => {
        resolve(encode(contents));
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export async function deleteFromStorage(fileName: string): Promise<void> {
  if (!fileName) return;

  try {
    await bucket.file(fileName).delete();
  } catch (error) {
    console.error(`Failed to delete GCS object ${fileName}:`, error);
  }
}
