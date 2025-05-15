interface ContentSecurityPolicy {
  directives: {
    defaultSrc: string[];
    styleSrc: string[];
    scriptSrc: string[];
    fontSrc: string[];
  };
}

interface Token {
  ACCESS: string;
  REFRESH: string;
}

export const API_VERSION = process.env.API_VERSION || 'v1';
export const API_PREFIX = process.env.API_PREFIX || 'api';
export const ROUTING_FILE = process.env.ROUTING_FILE || 'route';
export const MODULE_ROOT_DIR = process.env.MODULE_ROOT_DIR || 'modules';

export const CONTENT_SECURITY_POLICY: ContentSecurityPolicy = {
  directives: {
    defaultSrc: ["'self'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    scriptSrc: ["'self'", "'unsafe-inline'"],
    fontSrc: ["'self'", 'fonts.gstatic.com'],
  },
};

export const TOKEN: Token = {
  ACCESS: 'accessToken',
  REFRESH: 'refreshToken',
};
