import slugify from 'slugify';

export const createSlug = (items: string[]): string => {
  if (!Array.isArray(items) || items.length === 0) {
    return '';
  }

  return slugify(
    items
      .map((item) =>
        item.toLowerCase().replace(/\//g, '-').replace(/\s+/g, '-')
      )
      .join('-'),
    {
      replacement: '-',
      remove: /[*+~.()',"!:@]/g,
      lower: true,
      trim: true,
    }
  );
};
