import { config } from './env.config';

const isValidObjectOrArray = (value: any): boolean => {
  if (Array.isArray(value)) {
    return value.length > 0;
  } else if (typeof value === 'object' && value !== null) {
    return Object.keys(value).length > 0;
  }
  return true;
};

export const validateConfig = (): string => {
  const envVariables = Object.keys(config);

  const missingVariables = envVariables.filter(
    (variable) => !process.env[variable]
  );

  if (missingVariables.length > 0) {
    console.error(
      'Missing environment variables:',
      missingVariables.join(', ')
    );
    process.exit(1); // Stop the server
  }

  // //   let message = '';
  // //   const envConfig: Record<string, any> = config;
  // //   for (const key in envConfig) {
  // //     if (config.hasOwnProperty(key)) {
  // //       const value = envConfig[key];

  // //       if (value === undefined || value === null) {
  // //         message = `Property '${key}' is missing or invalid`;
  // //       }

  // //       if (
  // //         typeof value === 'object' &&
  // //         value !== null &&
  // //         !isValidObjectOrArray(value)
  // //       ) {
  // //         message = `Property '${key}' is an empty object or array`;
  // //         return message;
  // //       }
  // //     }
  // //   }

  //   return message;
  return '';
};
