import { lightTheme } from "@/constants/lightTheme";
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface NumberGoalProps {
  theme: typeof lightTheme;
  t: (key: string) => string;
}

const NumberGoal: React.FC<NumberGoalProps> = ({ theme, t }) => {
  return (
    <LinearGradient
      colors={["#117391", "#0fbdf2"]}
      start={{ x: 0.5, y: 1 }}
      end={{ x: 0.5, y: 0 }}
      style={styles.container}
    >
      <Text style={styles.title}>{t("number_goal")}</Text>
      <Text style={styles.description}>{t("number_goal_eg")}</Text>

      {/* Hiển thị tiến trình */}
      <Text style={styles.progressText}>4 / 12</Text>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: "33%" }]} />
      </View>
    </LinearGradient>
  );
};

export default NumberGoal;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: 20,
    borderRadius: 20,
    marginBottom: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
  },
  description: {
    fontSize: 14,
    color: "white",
    marginTop: 5,
  },
  progressText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    marginTop: 10,
  },
  progressBar: {
    height: 8,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 4,
    marginTop: 5,
    width: "100%",
  },
  progressFill: {
    height: 8,
    backgroundColor: "white",
    borderRadius: 4,
  },
});
