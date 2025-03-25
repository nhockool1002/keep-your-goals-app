import React, { useState } from "react";
import { View, Text, StyleSheet, Modal, Pressable } from "react-native";
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
  onSubmit?: () => void;
}

const AddGoalModal: React.FC<AddGoalModalProps> = ({ isVisible, onClose, theme, t, onSubmit }) => {
  const [selectedGoalType, setSelectedGoalType] = useState<"do" | "number" | "money" | null>(null);

  const handleClose = () => {
    setSelectedGoalType(null);
    onClose();
  };

  const handleSaved = () => {
    if (onSubmit) {
      onSubmit();
    }
    handleClose();
  };

  const commonProps = {
    visible: !!selectedGoalType,
    mode: "add" as const,
    onClose: handleClose,
    onSaved: handleSaved,
    t,
    onSubmit,
  };

  return (
    <Modal animationType="slide" transparent={true} visible={isVisible} onRequestClose={handleClose}>
      <View style={styles.modalContainer}>
        <View style={[styles.modalContent, { backgroundColor: theme.bgModalAddGoal }]}>
          {!selectedGoalType ? (
            <>
              <Text style={[styles.modalTitle, { color: theme.textColorTitleModalAddGoal }]}>{t("add_goal")}</Text>

              <Pressable style={{ width: "100%" }} onPress={() => setSelectedGoalType("do")}>
                <View>
                  <DoSomethingGoal t={t} theme={theme} />
                </View>
              </Pressable>

              <Pressable style={{ width: "100%" }} onPress={() => setSelectedGoalType("number")}>
                <View>
                  <NumberGoal t={t} theme={theme} />
                </View>
              </Pressable>

              <Pressable style={{ width: "100%" }} onPress={() => setSelectedGoalType("money")}>
                <View>
                  <MoneyGoal t={t} theme={theme} />
                </View>
              </Pressable>

              <Pressable onPress={handleClose}>
                <Text style={styles.closeText}>{t("close")}</Text>
              </Pressable>
            </>
          ) : (
            <>
              {selectedGoalType === "do" && <DoSomethingGoalDetails {...commonProps} />}
              {selectedGoalType === "number" && <NumberGoalDetails {...commonProps} />}
              {selectedGoalType === "money" && <MoneyGoalDetails {...commonProps} />}
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
    marginTop: 16,
  },
});
