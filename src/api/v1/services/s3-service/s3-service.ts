import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { generateCode } from '../../utils';
import { s3Client, Bucket } from './aws';

interface UploadParams {
  buffer: Buffer;
  mimetype: string;
  prefix?: string;
  ext?: string;
  Key?: string;
}

interface UploadStreamParams {
  response: Response;
  prefix?: string;
  ext?: string;
}

const generateKey = ({ prefix, ext }: { prefix?: string; ext?: string }) => {
  let key = '';
  if (prefix && typeof prefix === 'string') {
    key = `${prefix}/`;
  }

  key += `${generateCode(12, 'string').toLocaleLowerCase()}_${Date.now()}${ext || ''}`;

  return key;
};

const uploadFile = async ({
  buffer,
  mimetype,
  prefix,
  ext,
  Key = '',
}: UploadParams): Promise<string | void> => {
  try {
    const fileKey = Key || generateKey({ prefix, ext });

    const params = {
      Bucket: Bucket,
      Body: buffer,
      Key: fileKey,
      ContentType: mimetype,
    };

    const command = new PutObjectCommand(params);
    await s3Client.send(command);

    return fileKey;
  } catch (error) {
    console.error(error);
  }
};

const apiFileUpload = async ({
  buffer,
  mimetype,
  prefix,
  ext,
}: UploadParams): Promise<string> => {
  const Key = generateKey({ prefix, ext });
  const params = {
    Bucket: Bucket,
    Body: buffer,
    Key,
    ContentType: mimetype,
  };
  const command = new PutObjectCommand(params);
  await s3Client.send(command);

  return Key;
};

const removeFile = async (Key: string): Promise<void> => {
  const params = {
    Bucket: Bucket,
    Key,
  };

  const command = new DeleteObjectCommand(params);
  await s3Client.send(command);
};

const uploadStream = async ({
  response,
  prefix,
  ext,
}: UploadStreamParams): Promise<string> => {
  const Key = generateKey({ prefix, ext });

  const params = {
    Bucket: Bucket,
    Key,
    Body: response.body as any,
    ContentType:
      response.headers.get('content-type') || 'application/octet-stream',
  };

  const upload = new Upload({
    client: s3Client,
    params,
  });

  await upload.done();

  return Key;
};

export const s3Bucket = {
  apiFileUpload,
  removeFile,
  uploadStream,
  uploadFile,
};
