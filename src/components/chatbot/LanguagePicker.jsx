import React from 'react';

const LanguagePicker = ({ selectedLanguage, onSelectLanguage }) => {
  const languages = [
    { code: "en", name: "English" },
    { code: "hi", name: "हिन्दी (Hindi)" }
  ];
  
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