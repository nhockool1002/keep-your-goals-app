import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

import en from './en.json';
import vi from './vi.json';

const resources = {
  en: { translation: en },
  vi: { translation: vi },
};

// 🔹 Hàm lấy ngôn ngữ từ thiết bị (Fix lỗi `locale` bị deprecated)
const getDeviceLanguage = () => {
  const locales = Localization.getLocales();
  console.info(`>> [i18n] locales ${locales[0].languageCode}`)
  if (locales && locales.length > 0) {
    return locales[0].languageCode === 'vi' ? 'vi' : 'en';
  }
  return 'en';
};

// 🔹 Hàm lấy ngôn ngữ từ AsyncStorage hoặc thiết bị
const getInitialLanguage = async () => {
  try {
    const storedLang = await AsyncStorage.getItem('appLanguage');

    if (storedLang) {
      console.log(`[i18n] Language is storedLang ${storedLang}`);
      return storedLang;
    }

    const deviceLang = getDeviceLanguage();
    await AsyncStorage.setItem('appLanguage', deviceLang);
    console.log(`[i18n] Language is ${deviceLang}`);
    return deviceLang;
  } catch (error) {
    console.error("Lỗi khi lấy ngôn ngữ:", error);
    return 'vi'; // Nếu có lỗi, mặc định là tiếng Việt
  }
};

// 🔹 Khởi tạo i18n với ngôn ngữ ban đầu
getInitialLanguage().then((language) => {
  i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: language,
      fallbackLng: 'vi',
      interpolation: { escapeValue: false },
    });
});

export default i18n;
