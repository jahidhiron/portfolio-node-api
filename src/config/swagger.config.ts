import { companySwagger } from '../api/v1/modules/company/company.swagger';
import { domainSwagger } from '../api/v1/modules//domain/domain.swagger';
import { authSwagger } from '../api/v1/modules/auth/auth.swagger';
import { userSwagger } from '../api/v1/modules/user/user.swagger';
import { configuratorSwagger } from '../api/v1/modules/configurator/configurator.swagger';
import swaggerConfig from './swagger.json';
import { requestSwagger } from '../api/v1/modules/request/request.swagger';
import { wheelSwagger } from '../api/v1/modules/wheel/wheel.swagger';
import { roleSwagger } from '../api/v1/modules/role/role.swagger';
import { userLoginHistorySwagger } from '../api/v1/modules/histories/histories.swagger';
import { fileSwagger } from '../api/v1/modules/file/file.swagger';
import { dashboardSwagger } from '../api/v1/modules/dashboard/dashboard.swagger';
import { apiRequestSwagger } from '../api/v1/modules/api-requests/api-request.swagger';
export const swaggerOptions = {
  ...swaggerConfig,
  paths: {
    ...authSwagger.paths,
    ...userSwagger.paths,
    ...companySwagger.paths,
    ...domainSwagger.paths,
    ...requestSwagger.paths,
    ...wheelSwagger.paths,
    ...roleSwagger.paths,
    ...userLoginHistorySwagger.paths,
    ...configuratorSwagger.paths,
    ...fileSwagger.paths,
    ...dashboardSwagger.paths,
    ...apiRequestSwagger.paths,
  },
  components: {
    schemas: {
      ...(authSwagger.components?.schemas || {}),
      ...(userSwagger.components?.schemas || {}),
      ...(companySwagger.components?.schemas || {}),
      ...(domainSwagger.components?.schemas || {}),
      ...(requestSwagger.components?.schemas || {}),
      ...(wheelSwagger.components?.schemas || {}),
      ...(roleSwagger.components?.schemas || {}),
      ...(userLoginHistorySwagger.components?.schemas || {}),
      ...(configuratorSwagger.components?.schemas || {}),
      ...(fileSwagger.components?.schemas || {}),
      ...(dashboardSwagger.components?.schemas || {}),
      ...(apiRequestSwagger.components?.schemas || {}),
    },
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
};
