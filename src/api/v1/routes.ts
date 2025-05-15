import { Express, Router } from 'express';
import { getModules } from './utils/get-modules';
import { API_PREFIX, API_VERSION } from '../../config/constants';

interface Module {
  router: Router;
  base: string;
}

export const setupRoute = async (app: Express): Promise<void> => {
  if (
    Object.prototype.hasOwnProperty.call(app, 'listen') &&
    typeof app.listen === 'function'
  ) {
    const modules: Module[] = await getModules();
    for (const { router, base } of modules) {
      if (Object.getPrototypeOf(router) === Router) {
        app.use(`/${API_PREFIX}/${API_VERSION}/${base}`, router);
      }
    }
  }
};
