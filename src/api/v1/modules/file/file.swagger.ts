import FileSchema from './swagger/schema.swagger.json';
import fileInfo from './swagger/info.swagger.json';
import fileUploadPath from './swagger/file-upload.swagger.json';
import fileListPath from './swagger/file-list.swagger.json';
import fileDetailPath from './swagger/file-detail.swagger.json';
import fileDeletePath from './swagger/file-delete.swagger.json';

export const fileSwagger = {
  openapi: '3.0.0',
  ...fileInfo,
  security: [
    {
      bearerAuth: [],
    },
  ],
  paths: {
    '/files/upload': {
      ...fileUploadPath,
    },
    '/files': {
      ...fileListPath,
      ...fileDeletePath,
    },
    '/files/detail': {
      ...fileDetailPath,
    },
  },
  components: {
    ...FileSchema,
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
};
