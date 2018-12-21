import i18next from 'i18next'
import en_US from './locales/en_US.json'
import es_ES from './locales/es_ES.json'
import { reactI18nextModule } from 'react-i18next'

i18next
  .use(reactI18nextModule)
  .init({
    debug: false,
    fallbackLng: 'en_US',
    resources: {
      en_US: {
        translation: en_US
      },
      es_ES: {
        translation: es_ES
      }
    },
    react: {
      wait: true
    },
    initImmediate: true
  })

export default i18next
