import i18n from "i18next";
import { initReactI18next } from "react-i18next";     
i18n.use(initReactI18next)
    .init({
        resources: {
            en: {
                translation: Object.assign(Object.assign({}, require('./locales/en/translation.json')))
            }
            ,fr: {
                translation: Object.assign(Object.assign({}, require('./locales/fr/translation.json')))
            }
        },
        fallbackLng: 'en',
        debug: false
    });