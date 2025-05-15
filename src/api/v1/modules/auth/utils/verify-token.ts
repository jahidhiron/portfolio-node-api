export const verifyToken = (
  expiredAt: Date,
  storedToken: string,
  token: string
): string => {
  if (storedToken !== token) return 'error-invalid-token';

  if (storedToken !== token) {
    return 'error-invalid-token';
  }
  return '';
};
