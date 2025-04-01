import AWS from "aws-sdk";

import path from "path";

const uid = require("uid-safe");

const s3 = new AWS.S3();

const encode = (data: any) => {
  let buffer = Buffer.from(data);
  let base64 = buffer.toString("base64");
  return base64;
};

export const upload = async (
  originalName: string,
  fileContent: AWS.S3.Body,
  contentType: string
): Promise<AWS.S3.ManagedUpload.SendData> => {
  let ext = path.extname(originalName);
  const params: AWS.S3.PutObjectRequest = {
    Bucket: process.env.AWS_BUCKET_NAME || "danger-zone",
    Key: uid.sync(18) + ext,
    Body: fileContent,
    ContentType: contentType,
    ACL: "public-read",
  };
  return s3.upload(params).promise();
};

export const download = (disk: string, file_name: string) => {
  return new Promise((resolve, reject) => {
    let key = `${disk}${file_name}`;
    s3.getObject({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: key,
    })
      .promise()
      .then(({ Body }) => {
        resolve(encode(Body));
      })
      .catch((error) => {
        reject(error);
      });
  });
};
