interface Field {
  location: string;
  nested: string[] | null;
}

interface LimitItem {
  KEY_PREFIX: string;
  POINTS: number;
  DURATION_IN_SEC: number;
  FIELDS: Field[];
}

interface Limits {
  LOGIN: {
    ITEMS: LimitItem[];
  };
  VERIFY: {
    ITEMS: LimitItem[];
  };
  FORGOT_PASSWORD: {
    ITEMS: LimitItem[];
  };
}

export const COMMON = {
  DURATION_IN_SEC: 86400,
  BLOCK_DURATION_IN_SEC: 86400,
};

export const KEY = {
  KEY_LOGIN_IP: 'login_ip',
  KEY_LOGIN_EMAIL: 'login_email',
  KEY_LOGIN_EMAIL_IP: 'login_email_ip',
  KEY_VERIFY_EMAIL: 'verify_email',
  KEY_FORGOT_PASSWORD_EMAIL: 'forgot_password_email',
} as const;

export const TABLE_NAME = 'RateLimits';

export const LIMITS: Limits = {
  LOGIN: {
    ITEMS: [
      {
        ...COMMON,
        KEY_PREFIX: KEY.KEY_LOGIN_IP,
        POINTS: 100,
        FIELDS: [{ location: 'ip', nested: null }],
      },
      {
        ...COMMON,
        KEY_PREFIX: KEY.KEY_LOGIN_EMAIL,
        POINTS: 50,
        FIELDS: [{ location: 'email', nested: ['body'] }],
      },
      {
        KEY_PREFIX: KEY.KEY_LOGIN_EMAIL_IP,
        POINTS: 10,
        DURATION_IN_SEC: 3600,
        FIELDS: [
          { location: 'email', nested: ['body'] },
          { location: 'ip', nested: null },
        ],
      },
    ],
  },
  VERIFY: {
    ITEMS: [
      {
        ...COMMON,
        KEY_PREFIX: KEY.KEY_VERIFY_EMAIL,
        POINTS: 10,
        FIELDS: [{ location: 'email', nested: ['body'] }],
      },
    ],
  },
  FORGOT_PASSWORD: {
    ITEMS: [
      {
        ...COMMON,
        KEY_PREFIX: KEY.KEY_FORGOT_PASSWORD_EMAIL,
        POINTS: 10,
        FIELDS: [{ location: 'email', nested: ['body'] }],
      },
    ],
  },
};
