import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

interface Props {
  onClose: () => void;
  t: (key: string) => string;
}

const DoSomethingGoalDetails: React.FC<Props> = ({ onClose, t }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("add_goal")}</Text>
      <Text style={styles.description}>{t("do_something_goal_description")}</Text>

      {/* Nút đóng */}
      <TouchableOpacity onPress={onClose}>
        <Text style={styles.closeText}>{t("close")}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DoSomethingGoalDetails;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: 20,
    borderRadius: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
  },
  description: {
    fontSize: 14,
    color: "white",
    textAlign: "center",
    marginVertical: 10,
  },
  closeText: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
    fontWeight: "bold",
  },
});
