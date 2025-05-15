import { S3Client } from '@aws-sdk/client-s3';

if (
  !process.env.AWS_REGION ||
  !process.env.AWS_ACCESS_KEY ||
  !process.env.AWS_SECRET_KEY
) {
  throw new Error('Missing AWS environment variables');
}

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_KEY!,
  },
  requestHandler: {
    connectionTimeout: 300000,
    socketTimeout: 300000,
  },
});

const Bucket: string = process.env.AWS_S3_BUCKET_NAME || '';

export { s3Client, Bucket };
