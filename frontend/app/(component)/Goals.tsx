import { lightTheme } from "@/constants/lightTheme";
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, Dimensions, TouchableOpacity, Modal, Alert, ActivityIndicator, RefreshControl } from "react-native";
import { ProgressBar } from "react-native-paper";
import moment from "moment";
import { Icon } from "react-native-elements";
import DoSomethingGoalDetails from "./DoSomethingGoalDetails";
import MoneyGoalDetails from "./MoneyGoalDetails";
import NumberGoalDetails from "./NumberGoalDetails";

const screenWidth = Dimensions.get("window").width;

interface Goal {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
  amount: number;
  current: number;
  type: string;
}

interface GoalsProps {
  goals: Goal[];
  theme: typeof lightTheme;
  t: (key: string) => string;
  i18n: any;
}

const getBackgroundColor = (type: string, theme: typeof lightTheme) => {
  return theme.dstBgColorGoal;
};

const calculateProgress = (current: number, amount: number) => {
  return amount > 0 ? Math.min(Math.round((current / amount) * 100), 100) : 0;
};

const formatDate = (date: string) => moment(date).format("DD-MM-YYYY");

const Goals: React.FC<GoalsProps> = ({ goals, theme, t, i18n }) => {
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onClose = () => setSelectedGoal(null);
  const onSaved = () => setSelectedGoal(null);

  const commonProps = {
    visible: !!selectedGoal,
    mode: "edit" as const,
    onClose,
    onSaved,
    t,
  };

  const fetchGoals = async () => {
    setIsLoading(true);
    try {
      // Implement the logic to fetch goals
    } catch (e) {
      setError("Error fetching goals");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.homeBgColor }]}> 
      <FlatList
        data={goals}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const progress = calculateProgress(item.current, item.amount);
          return (
            <TouchableOpacity onPress={() => setSelectedGoal(item)}>
              <View style={[styles.goalItem, { backgroundColor: getBackgroundColor(item.type, theme) }]}> 
                <View style={[styles.containerTitle, { flexDirection: 'row', alignItems: 'center' }]}> 
                  <Icon
                    name="trophy-outline"
                    type="ionicon"
                    size={28}
                    color={
                      item.type === "SAVEMONEY" ? "#43e86a" :
                      item.type === "TODOQUANTITY" ? "#87CEEB" :
                      item.type === "TODOANYTHING" ? "#FF1493" :
                      "gray"
                    }
                    style={styles.icon}
                  />
                  <Text style={[styles.title, { color: theme.goalTitleTextColor }]} numberOfLines={1} ellipsizeMode="tail">
                    {item.title}
                  </Text>
                </View>

                {(item.type === "SAVEMONEY" || item.type === "TODOQUANTITY") && (
                  <View style={styles.goalRow}>
                    <Text style={[styles.progressText, { color: theme.goalTitleTextColor }]}> {item.current} / {item.amount} </Text>
                    <Text style={[styles.dateText, { color: theme.primary }]}> <Icon name="today" type="ionicon" size={12} color={
                      moment(item.endDate).isAfter(moment()) ? theme.calendarE :
                      moment(item.endDate).isSame(moment(), 'day') ? theme.calendarB :
                      theme.calendarO
                    } /> {" " + formatDate(item.endDate)} </Text>
                  </View>
                )}

                {(item.type === "SAVEMONEY" || item.type === "TODOQUANTITY") && (
                  <ProgressBar progress={progress / 100} color="#43e86a" style={styles.progressBar} />
                )}

                {item.type === "TODOANYTHING" && (
                  <>
                    <View style={styles.goalRow}>
                      <Text style={[styles.description, { color: theme.primary }]}>{item.description}</Text>
                      <Text style={[styles.dateText, { color: theme.primary }]}> <Icon name="today" type="ionicon" size={12} color={
                        moment(item.endDate).isAfter(moment()) ? theme.calendarE :
                        moment(item.endDate).isSame(moment(), 'day') ? theme.calendarB :
                        theme.calendarO
                      } /> {" " + formatDate(item.endDate)} </Text>
                    </View>
                  </>
                )}
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={<View style={[styles.container, { backgroundColor: theme.homeBgColor }]}><Text style={styles.noGoals}>{t("no_goals")}</Text></View>}
        showsVerticalScrollIndicator={false}
      />

      <Modal
        visible={!!selectedGoal}
        animationType="slide"
        transparent={true}
        onRequestClose={onClose}
      >
        <View style={styles.modalOverlay}>
          {selectedGoal?.type === 'SAVEMONEY' && (
            <MoneyGoalDetails 
              goal={selectedGoal} 
              visible={!!selectedGoal}
              mode="edit"
              onClose={onClose}
              onSaved={onSaved}
              t={t}
            />
          )}
          {selectedGoal?.type === 'TODOQUANTITY' && (
            <NumberGoalDetails 
              goal={selectedGoal} 
              visible={!!selectedGoal}
              mode="edit"
              onClose={onClose}
              onSaved={onSaved}
              t={t}
            />
          )}
          {selectedGoal?.type === 'TODOANYTHING' && (
            <DoSomethingGoalDetails 
              goal={selectedGoal} 
              visible={!!selectedGoal}
              mode="edit"
              onClose={onClose}
              onSaved={onSaved}
              t={t}
            />
          )}
        </View>
      </Modal>
    </View>
  );
};

export default Goals;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 10,
    paddingBottom: 0,
  },
  goalItem: {
    width: screenWidth - 32,
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
    alignSelf: "center",
  },
  containerTitle: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10
  },
  icon: {
    marginRight: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  goalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  progressText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  dateText: {
    fontSize: 14,
    fontWeight: "300",
  },
  progressBar: {
    height: 6,
    borderRadius: 5,
    marginVertical: 5,
  },
  description: {
    fontSize: 14,
    marginTop: 5,
    width: 280,
  },
  noGoals: {
    textAlign: "center",
    marginTop: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
});
