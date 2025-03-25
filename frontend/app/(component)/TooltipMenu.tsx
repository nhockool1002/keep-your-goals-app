import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { removeToken } from "@/utils/storageUtil";

interface TooltipMenuProps {
  isVisible: boolean;
  onClose: () => void;
  t: (key: string) => string;
  setIsGoalHidden: (value: boolean) => void; // Thêm setIsGoalHidden vào props
}

const TooltipMenu: React.FC<TooltipMenuProps> = ({ isVisible, onClose, t, setIsGoalHidden }) => {
  const [isGoalHidden, setGoalHidden] = useState(false); // Local state to track visibility
  const router = useRouter();

  useEffect(() => {
    const fetchGoalVisibility = async () => {
      const hideDoneGoal = await AsyncStorage.getItem("HideDoneGoal");
      setGoalHidden(hideDoneGoal === "Y");
    };

    fetchGoalVisibility();
  }, []);

  const handleLogout = async () => {
    await removeToken();
    router.replace("/");
  };

  const toggleGoalVisibility = async () => {
    const newState = !isGoalHidden;
    setGoalHidden(newState);
    setIsGoalHidden(newState); 
    onClose();
    await AsyncStorage.setItem("HideDoneGoal", newState ? "Y" : "N");
  };

  return (
    <Modal transparent={true} visible={isVisible} animationType="none" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlayBackground} onPress={onClose}>
        <View style={styles.tooltip}>
          <TouchableOpacity onPress={() => alert("Cài đặt mở ra sau")}>
            <Text style={styles.tooltipText}>{t("settings")}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => alert("Thông tin ứng dụng")}>
            <Text style={styles.tooltipText}>{t("app_info")}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleLogout}>
            <Text style={[styles.tooltipText, styles.logoutText]}>{t("logout")}</Text>
          </TouchableOpacity>

          {/* Thêm mục Ẩn/Hiện mục tiêu hoàn thành */}
          <TouchableOpacity onPress={toggleGoalVisibility}>
            <Text style={[styles.tooltipText, { color: "green" }]}>
              {isGoalHidden ? t("show_done_goals") : t("hide_done_goals")}
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default TooltipMenu;

const styles = StyleSheet.create({
  overlayBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  tooltip: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 8,
    width: 300,
    alignItems: "center",
  },
  tooltipText: {
    fontSize: 16,
    paddingVertical: 10,
  },
  logoutText: {
    color: "red",
    fontWeight: "bold",
  },
});
