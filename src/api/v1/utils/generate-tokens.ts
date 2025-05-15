import { generateJwtToken } from './generate-jwt-token';
import { config } from '../../../config';
import { JwtTokenPayload } from './interface';

interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

export const generateTokens = async (
  tokenPayload: JwtTokenPayload
): Promise<TokenResponse> => {
  const payload = {
    ...tokenPayload,
    aud: config.APP_NAME,
  };

  delete payload.exp;
  delete payload.iat;
  delete payload.iss;

  const [accessToken, refreshToken] = await Promise.all([
    generateJwtToken({
      payload,
      expiresIn: config.JWT_ACCESS_TOKEN_EXPIRED_IN as string,
      secret: config.JWT_ACCESS_TOKEN_SECRET as string,
    }),
    generateJwtToken({
      payload,
      expiresIn: config.JWT_REFRESH_TOKEN_EXPIRED_IN as string,
      secret: config.JWT_REFRESH_TOKEN_SECRET as string,
    }),
  ]);

  return { accessToken, refreshToken };
};
