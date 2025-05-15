import UserSchema from '../user/swagger/schema.swagger.json';
import userInfo from './swagger/info.swagger.json';
import detailUserPath from './swagger/detail-user.swagger.json';
import updateProfilePath from './swagger/update-profile.swagger.json';
import deleteUserPath from './swagger/delete-user.swagger.json';
import userListPath from './swagger/user-list.swagger.json';
import currentUser from './swagger/current-user.swagger.json';
import createUser from './swagger/create-user.swagger.json';
import getCompanyUsersPath from './swagger/get-company-users.swagger.json';
export const userSwagger = {
  openapi: '3.0.0',
  ...userInfo,
  servers: [
    {
      url: '/users',
      description: 'Users API',
    },
  ],
  security: [
    {
      bearerAuth: [],
    },
  ],
  paths: {
    '/users/{id}': {
      ...detailUserPath,
      ...updateProfilePath,
      ...deleteUserPath,
    },
    '/users': {
      ...userListPath,
      ...createUser,
    },
    '/users/current': {
      ...currentUser,
    },
    '/users/company-users': {
      ...getCompanyUsersPath,
    },
  },

  components: {
    ...UserSchema,
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
};
