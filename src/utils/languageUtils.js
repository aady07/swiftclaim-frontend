export const SUPPORTED_LANGUAGES = {
  en: {
    locale: "en-IN",
    label: "English",
    voice: "Achird",
  },
  hi: {
    locale: "hi-IN",
    label: "हिन्दी (Hindi)",
    voice: "Achird",
  },
  te: {
    locale: "te-IN",
    label: "తెలుగు (Telugu)",
    voice: "Achird",
  },
};

export const DEFAULT_LANGUAGE = "en";

export const getLanguageLocale = (language) =>
  SUPPORTED_LANGUAGES[language]?.locale ?? SUPPORTED_LANGUAGES[DEFAULT_LANGUAGE].locale;

export const getLanguageVoice = (language) =>
  SUPPORTED_LANGUAGES[language]?.voice ?? SUPPORTED_LANGUAGES[DEFAULT_LANGUAGE].voice;

export const getLanguageLabel = (language) =>
  SUPPORTED_LANGUAGES[language]?.label ?? SUPPORTED_LANGUAGES[DEFAULT_LANGUAGE].label;

