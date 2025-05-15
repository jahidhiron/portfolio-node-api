import path from 'path';
import { I18n } from 'i18n';

export const i18n = new I18n({
  locales: ['en'],
  directory: path.join(__dirname, 'languages'),
  defaultLocale: 'en',
});
