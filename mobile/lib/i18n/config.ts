import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import de from '../../locales/de.json'
import ru from '../../locales/ru.json'
import uk from '../../locales/uk.json'
import en from '../../locales/en.json'

i18n.use(initReactI18next).init({
  resources: {
    de: { translation: de },
    ru: { translation: ru },
    uk: { translation: uk },
    en: { translation: en },
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
