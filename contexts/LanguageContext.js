import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '../utils/i18n';

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(i18n.locale);

  useEffect(() => {
    AsyncStorage.getItem('appLanguage').then((lang) => {
      if (lang) {
        i18n.locale = lang;
        setLanguage(lang);
      }
    });
  }, []);

  const changeLanguage = async (lang) => {
    i18n.locale = lang;
    setLanguage(lang);
    await AsyncStorage.setItem('appLanguage', lang);
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
