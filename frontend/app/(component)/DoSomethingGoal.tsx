import { lightTheme } from "@/constants/lightTheme";
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Icon } from "react-native-elements";

interface DoSomethingGoalProps {
  theme: typeof lightTheme;
  t: (key: string) => string;
}

const DoSomethingGoal: React.FC<DoSomethingGoalProps> = ({ theme, t }) => {
  return (
    <LinearGradient
      colors={["#ffa6f8", "#8c4587"]}
      start={{ x: 0.5, y: 1 }}
      end={{ x: 0.5, y: 0 }}
      style={styles.container}
    >
      <Text style={styles.title}>{t('do_something_goal')}</Text>
      <Text style={styles.description}>{t('do_something_eg')}</Text>

      {/* Trạng thái Goal */}
      <View style={styles.statusContainer}>
        <View style={styles.status}>
          <View style={styles.statusRow}>
            <Icon name="circle" type="feather" size={24} color="#995794" />
            <Text style={[styles.statusText, {color: '#995794'}]}>{t('goal_status_todo')}</Text>
          </View>
        </View>

        <View style={[styles.status, styles.completed]}>
          <View style={styles.statusRow}>
            <Icon name="check-circle" type="feather" size={24} color="green" />
            <Text style={[styles.statusText, {color: 'green'}]}>{t('goal_status_done')}</Text>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
};

export default DoSomethingGoal;

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
  statusContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  status: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: "rgba(212, 212, 212, 0.85)",
    marginRight: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  completed: {
    backgroundColor: "rgba(192, 255, 210, 0.7)",
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusText: {
    fontSize: 14,
    marginLeft: 5
  },
});
