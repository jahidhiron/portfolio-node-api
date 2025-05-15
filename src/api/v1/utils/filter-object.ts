export const filterObject = <T extends Record<string, any>>(
  source: T,
  exclude: string[] = []
): Partial<T> => {
  if (!source || typeof source !== 'object' || source === null) return source;

  return Object.entries(source).reduce((acc, [key, value]) => {
    if (exclude.includes(key)) {
      return acc;
    }

    if (value instanceof Date) {
      (acc as any)[key] = value;
      return acc;
    }

    const nestedExcludes = exclude
      .filter((e) => e.startsWith(`${key}.`))
      .map((e) => e.replace(`${key}.`, ''));

    if (typeof value === 'object' && value !== null) {
      (acc as any)[key] = filterObject(value, nestedExcludes);
    } else {
      (acc as any)[key] = value;
    }

    return acc;
  }, {} as Partial<T>);
};
