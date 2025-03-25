import React, { useEffect, useState } from "react";
import { View, Image, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";

interface LanguageSelectProps {
  onLanguageChange?: (lang: string) => void;
}

const LanguageSelect: React.FC<LanguageSelectProps> = ({ onLanguageChange }) => {
  const { i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);

  useEffect(() => {
    const getLanguage = async () => {
      try {
        const storedLang = await AsyncStorage.getItem("appLanguage");
        if (storedLang) {
          setSelectedLanguage(storedLang);
          i18n.changeLanguage(storedLang);
        } else {
          setSelectedLanguage("en"); // Mặc định English
          await AsyncStorage.setItem("appLanguage", "en");
        }
      } catch (error) {
        console.error("Lỗi khi lấy ngôn ngữ từ AsyncStorage:", error);
      }
    };
    getLanguage();
  }, []);

  const changeLanguage = async (lang: string) => {
    try {
      await AsyncStorage.setItem("appLanguage", lang);
      setSelectedLanguage(lang);
      i18n.changeLanguage(lang);
      onLanguageChange?.(lang);
    } catch (error) {
      console.error("Lỗi khi thay đổi ngôn ngữ:", error);
    }
  };

  return (
    <View style={styles.container}>
      {/* English */}
      <TouchableOpacity
        onPress={() => changeLanguage("en")}
        style={[
          styles.flagContainer,
          selectedLanguage === "en" ? styles.selected : null,
        ]}
      >
        <Image source={require("@/assets/images/us.png")} style={styles.flag} />
      </TouchableOpacity>

      {/* Vietnamese */}
      <TouchableOpacity
        onPress={() => changeLanguage("vi")}
        style={[
          styles.flagContainer,
          selectedLanguage === "vi" ? styles.selected : null,
        ]}
      >
        <Image source={require("@/assets/images/vn.png")} style={styles.flag} />
      </TouchableOpacity>
    </View>
  );
};

export default LanguageSelect;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(23, 4, 4, 0.8)",
    padding: 5,
    borderRadius: 30,
    elevation: 5,
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    zIndex: 9999
  },
  flagContainer: {
    marginHorizontal: 5,
    borderRadius: 25,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "transparent",
  },
  selected: {
    borderColor: "#2089dc", // Viền xanh khi được chọn
  },
  flag: {
    width: 25,
    height: 25,
    borderRadius: 20,
  },
});
