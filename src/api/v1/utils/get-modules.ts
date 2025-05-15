import fs from 'fs';
import path from 'path';
import { Router } from 'express';
import { MODULE_ROOT_DIR, ROUTING_FILE } from '../constants';

const root: string = path.join(__dirname, '..', MODULE_ROOT_DIR);

interface Module {
  router: Router;
  base: string;
}

export const getModules = async (): Promise<Module[]> => {
  return new Promise(async (resolve, reject) => {
    const modules: Module[] = [];

    fs.readdirSync(root).forEach((_module: string) => {
      fs.readdirSync(path.join(root, _module)).forEach(async (file: string) => {
        if (
          file === `${_module}.${ROUTING_FILE}.ts` ||
          file === `${_module}.${ROUTING_FILE}.js`
        ) {
          const route = await import(path.join(root, _module, file));
          const router = route.default.router || route.default;
          const base = route.default.base || _module;
          modules.push({ router, base });
        }
      });
    });

    resolve(modules);
  });
};
