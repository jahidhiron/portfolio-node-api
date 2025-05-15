// Optional: Use TypeScript's `type` for better parameter typing
type CodeType = 'string' | 'number' | null;

export const generateCode = (
  length: number = 8,
  type: CodeType = null
): string => {
  const characters =
    type === 'string'
      ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
      : type === 'number'
        ? '0123456789'
        : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

  let code = '';
  for (let i = 0; i < length; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
};
