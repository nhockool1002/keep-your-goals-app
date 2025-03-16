import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";
import DoSomethingGoal from "../(component)/DoSomethingGoal";
import NumberGoal from "../(component)/NumberGoal";
import MoneyGoal from "../(component)/MoneyGoal";
import DoSomethingGoalDetails from "../(component)/DoSomethingGoalDetails";
import NumberGoalDetails from "../(component)/NumberGoalDetails";
import MoneyGoalDetails from "../(component)/MoneyGoalDetails";
import { lightTheme } from "@/constants/lightTheme";

interface AddGoalModalProps {
  isVisible: boolean;
  onClose: () => void;
  theme: typeof lightTheme;
  t: (key: string) => string;
}

const AddGoalModal: React.FC<AddGoalModalProps> = ({ isVisible, onClose, theme, t }) => {
  const [selectedGoal, setSelectedGoal] = useState<"do" | "number" | "money" | null>(null);

  // Đóng modal và reset state
  const handleClose = () => {
    setSelectedGoal(null);
    onClose();
  };

  return (
    <Modal animationType="slide" transparent={true} visible={isVisible} onRequestClose={handleClose}>
      <View style={styles.modalContainer}>
        <View style={[styles.modalContent, { backgroundColor: theme.bgModalAddGoal }]}>
          {/* Nếu không có mục tiêu nào được chọn, hiển thị danh sách */}
          {!selectedGoal ? (
            <>
              <Text style={[styles.modalTitle, { color: theme.textColorTitleModalAddGoal }]}>{t("add_goal")}</Text>

              {/* Hiển thị 3 loại goal */}
              <TouchableOpacity style={{ width: "100%" }} onPress={() => setSelectedGoal("do")}>
                <DoSomethingGoal t={t} theme={theme} />
              </TouchableOpacity>
              <TouchableOpacity style={{ width: "100%" }} onPress={() => setSelectedGoal("number")}>
                <NumberGoal t={t} theme={theme} />
              </TouchableOpacity>
              <TouchableOpacity style={{ width: "100%" }} onPress={() => setSelectedGoal("money")}>
                <MoneyGoal t={t} theme={theme} />
              </TouchableOpacity>


              {/* Nút đóng */}
              <TouchableOpacity onPress={handleClose}>
                <Text style={styles.closeText}>{t("close")}</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              {/* Hiển thị chi tiết theo loại Goal được chọn */}
              {selectedGoal === "do" && <DoSomethingGoalDetails onClose={handleClose} t={t} />}
              {selectedGoal === "number" && <NumberGoalDetails onClose={handleClose} t={t} />}
              {selectedGoal === "money" && <MoneyGoalDetails onClose={handleClose} t={t} />}
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default AddGoalModal;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: "center",
    width: "100%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  closeText: {
    fontSize: 20,
    color: "red",
    textAlign: "center",
    fontWeight: "bold",
  },
});
