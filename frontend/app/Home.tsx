import React, { useEffect, useState } from "react";
import { View, StyleSheet, Platform, AppState, useColorScheme, Alert } from "react-native";
import { StatusBar } from "expo-status-bar";
import Constants from "expo-constants";
import Goals from "@/app/(component)/Goals";
import Trophies from "@/app/(component)/Trophies";
import Settings from "@/app/(component)/Settings";
import AddGoalModal from "@/app/(component)/AddGoalModal";
import BottomNavigation from "@/app/(component)/BottomNavigation";
import TooltipMenu from "@/app/(component)/TooltipMenu";
import HeaderGoals from "@/app/(component)/HeaderGoals";
import { getTheme } from "@/constants/theme";
import { useTranslation } from "react-i18next";
import { getToken, removeToken } from "@/utils/storageUtil";
import axios from "axios"; // ✅ Import axios
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage"; // ✅ Import AsyncStorage

interface Goal {
  id: string;
  userId: string;
  type: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
  quantity: number;
  amount: number;
  current: number;
  createdAt: string;
  updatedAt: string;
}

const Home = () => {
  const [isTooltipVisible, setTooltipVisible] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("goals");
  const [goals, setGoals] = useState<Goal[]>([]);
  const [hideDoneGoals, setHideDoneGoals] = useState(false);
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const theme = getTheme(isDarkMode);
  const { t, i18n } = useTranslation();

  const API_URL = Constants.expoConfig?.extra?.API_URL || "http://localhost:3000";

  const fetchGoals = async () => {
    try {
      const token = await getToken();
      if (!token) {
        Alert.alert("Error", "User not authenticated. Please log in.");
        return;
      }

      const response = await axios.get(`${API_URL}/v1/goals`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const hideDoneGoal = await AsyncStorage.getItem("HideDoneGoal");
      const shouldHideDoneGoals = hideDoneGoal === "Y";
      
      if (shouldHideDoneGoals) {
        const filteredGoals = response.data.goals.filter((goal: Goal) => goal.status !== "DONE");
        setGoals(filteredGoals);
      } else {
        setGoals(response.data.goals);
      }
    } catch (error: any) {
      if (error.response) {
        if (error.response.status === 401) {
          Alert.alert("Error", "Invalid or expired token");
          await removeToken();
          router.push("/");
        } else {
          Alert.alert("Error", error.response.data.message || "Failed to fetch goals");
        }
      } else {
        Alert.alert("Error", "Network error. Please try again.");
      }
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  useEffect(() => {
    const checkHideDoneGoals = async () => {
      const hideDoneGoal = await AsyncStorage.getItem("HideDoneGoal");
      setHideDoneGoals(hideDoneGoal === "Y");
    };

    checkHideDoneGoals();
  }, []);

  const filteredGoals = hideDoneGoals
    ? goals.filter((goal) => goal.status !== "DONE")
    : goals;

  const setIsGoalHidden = (value: boolean) => {
    setHideDoneGoals(value);
  };

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
          {activeTab === "goals" && <Goals goals={filteredGoals} theme={theme} t={t} i18n={i18n} />}
          {activeTab === "trophies" && <Trophies />}
          {activeTab === "settings" && <Settings />}
        </View>
      </View>

      {/* Đảm bảo màu nền dưới che phủ Home Indicator */}
      <View style={styles.bottomSafeArea}>
        <BottomNavigation activeTab={activeTab} setActiveTab={setActiveTab} theme={theme} t={t} />
      </View>

      {/* Tooltip Cài đặt */}
      <TooltipMenu
        isVisible={isTooltipVisible}
        onClose={() => setTooltipVisible(false)}
        t={t}
        setIsGoalHidden={setIsGoalHidden} // Pass setIsGoalHidden to TooltipMenu
      />

      {/* Popup Thêm Goals */}
      <AddGoalModal 
        isVisible={isModalVisible} 
        onClose={() => setModalVisible(false)} 
        theme={theme} 
        t={t}
        onSubmit={fetchGoals}
      />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    backgroundColor: "#2089dc",
  },
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  bottomSafeArea: {
    backgroundColor: "red",
    height: Platform.OS === "ios" ? 60 : 0,
  },
});
