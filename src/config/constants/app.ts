import { ContentSecurityPolicy } from './interface/content-security-policy.interface';

export const API_VERSION = 'v1';
export const API_PREFIX = 'api';
export const ROUTING_FILE = 'route';
export const MODULE_ROOT_DIR = 'modules';
export const BASE_ENTITY_FILE_NAME = 'entity';
export const LOG_DIR = 'logs';

export const CONTENT_SECURITY_POLICY: ContentSecurityPolicy = {
  directives: {
    defaultSrc: ["'self'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    scriptSrc: ["'self'", "'unsafe-inline'"],
    fontSrc: ["'self'", 'fonts.gstatic.com'],
  },
};
