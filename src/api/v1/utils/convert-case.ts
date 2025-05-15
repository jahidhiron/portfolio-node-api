export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const lowercase = (str: string): string => {
  return str.toLowerCase();
};

export const uppercase = (str: string): string => {
  return str.toUpperCase();
};
