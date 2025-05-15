type GenericObject = Record<string, any>;

export const shallowMerge = <T>(
  source: T,
  destination: GenericObject | null
): T => {
  const copy: T = source;

  if (
    typeof destination === 'object' &&
    !Array.isArray(destination) &&
    destination !== null
  ) {
    for (const [key, value] of Object.entries(destination)) {
      (copy as GenericObject)[key] = value;
    }
  }

  return copy;
};
