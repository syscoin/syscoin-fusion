import i18next from 'i18next'
import en_US from './locales/en_US.json'
import { reactI18nextModule } from 'react-i18next'

i18next
  .use(reactI18nextModule)
  .init({
    debug: false,
    fallbackLng: 'en_US',
    resources: {
      en_US: {
        translation: en_US
      }
    },
    react: {
      wait: true
    },
    initImmediate: true
  })

export default i18next
