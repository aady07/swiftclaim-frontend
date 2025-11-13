import React from 'react';
import { SUPPORTED_LANGUAGES } from '../../utils/languageUtils';

const LanguagePicker = ({ selectedLanguage, onSelectLanguage }) => {
  const languages = Object.entries(SUPPORTED_LANGUAGES).map(([code, config]) => ({
    code,
    name: config.label,
  }));

  return (
    <div className="language-picker">
      <div className="language-buttons">
        {languages.map((lang) => (
          <button
            key={lang.code}
            className={selectedLanguage === lang.code ? "active" : ""}
            onClick={() => onSelectLanguage(lang.code)}
          >
            {lang.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguagePicker;