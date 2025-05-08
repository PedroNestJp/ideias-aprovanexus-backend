// src/aws/s3.config.ts
import dotenv from 'dotenv';
dotenv.config();
import { S3 } from 'aws-sdk';
import { v4 as uuid } from 'uuid';
import { extname } from 'path';
import multerS3 = require('multer-s3');

const s3 = new S3({
  region: 'us-east-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

console.log('AWS_S3_BUCKET :>> ', process.env.AWS_S3_BUCKET);

export const getMulterS3Config = (subFolder: string) =>
  multerS3({
    s3,
    bucket: process.env.AWS_S3_BUCKET,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      const filename = `${Date.now()}-${uuid()}${extname(file.originalname)}`;
      const folder = `${subFolder}/${filename}`;
      cb(null, folder);
    },
  });
