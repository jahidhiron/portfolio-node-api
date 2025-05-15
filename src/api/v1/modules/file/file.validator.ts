export const validateExtension = (ext: string): boolean => {
  const allowedExtensions: string[] = [
    '.jpg',
    '.jpeg',
    '.png',
    '.mp4',
    '.wmv',
    '.webp',
    '.doc',
    '.docx',
    '.pdf',
    '.text',
    '.txt',
    '.csv',
  ];
  return allowedExtensions.includes(ext);
};
