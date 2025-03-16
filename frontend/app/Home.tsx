import React, { useEffect, useState } from "react";
import { View, StyleSheet, Platform, AppState, useColorScheme } from "react-native";
import { StatusBar } from "expo-status-bar";
import Constants from "expo-constants"; // ✅ Import Constants từ Expo
import Goals from "@/app/(component)/Goals";
import Trophies from "@/app/(component)/Trophies";
import Settings from "@/app/(component)/Settings";
import AddGoalModal from "@/app/(component)/AddGoalModal";
import BottomNavigation from "@/app/(component)/BottomNavigation";
import TooltipMenu from "@/app/(component)/TooltipMenu";
import HeaderGoals from "@/app/(component)/HeaderGoals";
import { getTheme } from "@/constants/theme";
import { useTranslation } from "react-i18next";

const Home = () => {
  const [isTooltipVisible, setTooltipVisible] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("goals");
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const theme = getTheme(isDarkMode);
  const { t } = useTranslation();

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "active") {
        console.log("App back from background.");
      }
    });

    return () => subscription.remove();
  }, []);

  return (
    <View style={styles.fullScreenContainer}>
      <StatusBar style={isDarkMode ? "light" : "dark"} backgroundColor={theme.primary} translucent />

      <View style={styles.container}>
        {/* Header */}
        <HeaderGoals 
          onOpenTooltip={() => setTooltipVisible(true)} 
          onOpenModal={() => setModalVisible(true)} 
          theme={theme}
          t={t}
        />

        {/* Nội dung chính */}
        <View style={styles.content}>
          {activeTab === "goals" && <Goals />}
          {activeTab === "trophies" && <Trophies />}
          {activeTab === "settings" && <Settings />}
        </View>
      </View>

      {/* ✅ Đảm bảo màu nền dưới che phủ Home Indicator */}
      <View style={styles.bottomSafeArea}>
        <BottomNavigation activeTab={activeTab} setActiveTab={setActiveTab} theme={theme} t={t} />
      </View>

      {/* Tooltip Cài đặt */}
      <TooltipMenu isVisible={isTooltipVisible} onClose={() => setTooltipVisible(false)} t={t} />

      {/* Popup Thêm Goals */}
      <AddGoalModal isVisible={isModalVisible} onClose={() => setModalVisible(false)} theme={theme} t={t} />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    backgroundColor: "#2089dc", // ✅ Đảm bảo Dynamic Island có màu xanh
  },
  container: {
    flex: 1,
    backgroundColor: "#121212", // ✅ Màu nền của nội dung chính
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  bottomSafeArea: {
    backgroundColor: "red", // ✅ Đảm bảo màu nền Home Indicator
    height: Platform.OS === "ios" ? 60 : 0, // ✅ Đảm bảo không có khoảng trắng
  },
});
