import RoleSchema from './swagger/schema.swagger.json';
import roleInfo from './swagger/info.swagger.json';
import createRolePath from './swagger/create-role.swagger.json';
import updateRolePath from './swagger/update-role.swagger.json';
import detailRolePath from './swagger/detail-role.swagger.json';
import deleteRolePath from './swagger/delete-role.swagger.json';
import listRolesPath from './swagger/list-roles.swagger.json';

export const roleSwagger = {
  openapi: '3.0.0',
  ...roleInfo,
  security: [
    {
      bearerAuth: [],
    },
  ],
  paths: {
    '/roles': { ...listRolesPath, ...createRolePath },
    '/roles/{id}': {
      ...updateRolePath,
      ...detailRolePath,
      ...deleteRolePath,
    },
  },

  components: {
    ...RoleSchema,
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
};
