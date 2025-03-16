import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";
import { removeToken } from "@/utils/storageUtil";
import { useRouter } from "expo-router";

interface TooltipMenuProps {
  isVisible: boolean;
  onClose: () => void;
  t: (key: string) => string;
}

const TooltipMenu: React.FC<TooltipMenuProps> = ({ isVisible, onClose, t }) => {
  const router = useRouter();

  const handleLogout = async () => {
    await removeToken();
    router.replace("/");
  };

  return (
    <Modal transparent={true} visible={isVisible} animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlayBackground} onPress={onClose}>
        <View style={styles.tooltip}>
          <TouchableOpacity onPress={() => alert("Cài đặt mở ra sau")}>
            <Text style={styles.tooltipText}>Cài đặt</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => alert("Thông tin ứng dụng")}>
            <Text style={styles.tooltipText}>Thông tin</Text>
          </TouchableOpacity>

          {/* Nút Đăng xuất */}
          <TouchableOpacity onPress={handleLogout}>
            <Text style={[styles.tooltipText, styles.logoutText]}>Đăng xuất</Text>
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
    width: 200,
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
