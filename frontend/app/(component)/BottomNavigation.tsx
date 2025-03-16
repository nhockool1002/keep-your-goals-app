import { lightTheme } from "@/constants/lightTheme";
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Icon } from "react-native-elements";

interface BottomNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  theme: typeof lightTheme;
  t: (key: string) => string;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeTab, setActiveTab, theme, t }) => {
  return (
    <View style={[styles.bottomBar, { backgroundColor: theme.bgBottomColor }]}>
      <TouchableOpacity style={styles.tabButton} onPress={() => setActiveTab("goals")}>
        <Icon name="flag" type="ionicon" size={28} color={activeTab === "goals" ? theme.colorBottomActive : theme.colorBottomInactive} />
        <Text style={[styles.tabText, { color: activeTab === "goals" ? theme.colorBottomActive : theme.colorBottomInactive }]}>
          Goals
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.tabButton} onPress={() => setActiveTab("trophies")}>
        <Icon name="trophy" type="ionicon" size={28} color={activeTab === "trophies" ? theme.colorBottomActive : theme.colorBottomInactive} />
        <Text style={[styles.tabText, { color: activeTab === "trophies" ? theme.colorBottomActive : theme.colorBottomInactive }]}>
          Trophies
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.tabButton} onPress={() => setActiveTab("settings")}>
        <Icon name="settings" type="ionicon" size={28} color={activeTab === "settings" ? theme.colorBottomActive : theme.colorBottomInactive} />
        <Text style={[styles.tabText, { color: activeTab === "settings" ? theme.colorBottomActive : theme.colorBottomInactive }]}>
          Settings
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default BottomNavigation;

const styles = StyleSheet.create({
  bottomBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 10,
    height: 80,
  },
  tabButton: {
    alignItems: "center",
  },
  tabText: {
    fontSize: 14,
    marginTop: 5,
  },
  activeText: {
    color: "#2089dc",
    fontWeight: "bold",
  },
});
