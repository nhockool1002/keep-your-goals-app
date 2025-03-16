import { lightTheme } from "@/constants/lightTheme";
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Icon } from "react-native-elements";

interface HeaderGoalsProps {
  onOpenTooltip: () => void;
  onOpenModal: () => void;
  theme: typeof lightTheme;
  t: (key: string) => string;
}

const HeaderGoals: React.FC<HeaderGoalsProps> = ({ onOpenTooltip, onOpenModal, theme, t }) => {
  return (
    <View style={[styles.header, {backgroundColor: theme.headerBgColor}]}>
      {/* Icon Tùy chọn (Tooltip) */}
      <TouchableOpacity onPress={onOpenTooltip}>
        <Icon name="menu" type="ionicon" size={28} color={theme.headerTextColor} />
      </TouchableOpacity>

      {/* Tiêu đề */}
      <Text style={[styles.headerTitle, {color: theme.headerTextColor}]}>{t('goals_title')}</Text>

      {/* Icon "+" (Mở Popup) */}
      <TouchableOpacity onPress={onOpenModal}>
        <Icon name="add-circle-outline" type="ionicon" size={32} color={theme.headerTextColor} />
      </TouchableOpacity>
    </View>
  );
};

export default HeaderGoals;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
