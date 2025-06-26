import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

const REACT_APP_URL = process.env.REACT_APP_URL;
// i18n Initialization
i18n
  .use(Backend) // Load translations using HTTP backend
  .use(initReactI18next) // Integrate with React
  .use(LanguageDetector) // Detect user's language
  .init({
    backend: {
      loadPath: `${REACT_APP_URL}/locales/{{lng}}/{{ns}}.json`,
    },
    debug: false, // Disable debug mode in production
    defaultNS: "translation", // Default namespace
    // lng: "de-CH",
    fallbackLng: false, // Disable fallback language
    interpolation: {
      escapeValue: false, // React handles escaping
    },
    keySeparator: ".", // Nested key separator
    load: "currentOnly", // Load current language only
    ns: ["translation"], // Namespaces
    returnEmptyString: true, // Allow empty strings
  });

export default i18n;
