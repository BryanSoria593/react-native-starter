import { I18n } from 'i18n-js';

import es from './es.json';
import en from './en.json';

const i18n = new I18n({ es, en });

i18n.locale = 'es';
i18n.defaultLocale = 'es';
i18n.enableFallback = true;

export { i18n };
