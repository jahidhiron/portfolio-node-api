import UserLoginHistorySchema from './swagger/schema.swagger.json';
import userLoginHistoryInfo from './swagger/info.swagger.json';
import getUserLoginHistoryPath from './swagger/detail-histories.swagger.json';
import getUserLoginHistoryListPath from './swagger/histories-list.swagger.json';
import updateUserLoginHistoryPath from './swagger/update-histories.swagger.json';
import deleteUserLoginHistoryPath from './swagger/delete-histories.swagger.json';

export const userLoginHistorySwagger = {
  openapi: '3.0.0',
  ...userLoginHistoryInfo,
  security: [
    {
      bearerAuth: [],
    },
  ],
  paths: {
    '/histories/{id}': {
      ...getUserLoginHistoryPath,
      // ...updateUserLoginHistoryPath,
      ...deleteUserLoginHistoryPath,
    },
    '/histories': { ...getUserLoginHistoryListPath },
  },

  components: {
    ...UserLoginHistorySchema,
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
};
