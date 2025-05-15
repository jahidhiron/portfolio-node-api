import RequestSchema from './swagger/schema.swagger.json';
import requestInfo from './swagger/info.swagger.json';
import createRequestPath from './swagger/create-api-request.swagger.json';
import listRequestPath from './swagger/list-api-request.swagger.json';
import statisticsPath from './swagger/statistics.swagger.json';
export const apiRequestSwagger = {
  openapi: '3.0.0',
  ...requestInfo,
  security: [
    {
      bearerAuth: [],
    },
  ],
  paths: {
    '/api-requests': { ...createRequestPath, ...listRequestPath },
    '/api-requests/statistics': { ...statisticsPath },
  },

  components: {
    ...RequestSchema,
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
};
