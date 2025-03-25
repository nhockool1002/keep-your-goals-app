import React, { useState } from "react";
import { Modal, View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Platform } from "react-native";
import { Input, Button } from "react-native-elements";
import DateTimePicker from "@react-native-community/datetimepicker";
import api from "@/services/api";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import Constants from "expo-constants";
import axios from "axios";

const API_URL = Constants.expoConfig?.extra?.API_URL || "http://localhost:3000";

type Props = {
  goal?: any;
  visible: boolean;
  mode: "add" | "edit";
  onClose: () => void;
  onSaved: () => void;
  t: (key: string) => string;
  onSubmit?: () => void;
};

const DoSomethingGoalDetails = ({ goal, visible, mode, onClose, onSaved, t, onSubmit }: Props) => {
  const [title, setTitle] = useState(goal?.title || "");
  const [description, setDescription] = useState(goal?.description || "");
  const [startDate, setStartDate] = useState(goal?.startDate ? new Date(goal.startDate) : new Date());
  const [endDate, setEndDate] = useState(goal?.endDate ? new Date(goal.endDate) : new Date());
  const [amount, setAmount] = useState(goal?.amount?.toString() || "");
  const [current, setCurrent] = useState(goal?.current?.toString() || "");
  const [status, setStatus] = useState(goal?.status || "TODO");
  const [note, setNote] = useState(goal?.note || "");
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showStatusPicker, setShowStatusPicker] = useState(false);

  const screenTitle = mode === "edit" ? t("update_goal") + " TODOANYTHING" : t("add_goal") + " TODOANYTHING";

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const handleSubmit = async () => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      let payload;
      
      if (mode === "edit" && goal?.id) {
        payload = {
          endDate: formatDate(endDate),
          status,
          note,
          current: Number(current)
        };
        console.log(`payload ${JSON.stringify(payload)}`)
        await axios.patch(`${API_URL}/v1/goals/${goal.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        payload = {
          type: "TODOANYTHING",
          title,
          description,
          startDate: formatDate(startDate),
          endDate: formatDate(endDate),
          status: "TODO",
          quantity: 1,
          amount: Number(amount),
          current: Number(current)
        };
        console.log(`payload ${JSON.stringify(payload)}`)
        await axios.post(`${API_URL}/v1/goals`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      if (onSubmit) {
        onSubmit();
      }
      onSaved();
      onClose();
    } catch (e: any) {
      const errorMessage = e.response?.data?.message || e.message || "Có lỗi xảy ra khi lưu mục tiêu";
      Alert.alert("Lỗi", errorMessage);
      if (e.response?.status === 401) {
        await AsyncStorage.removeItem("accessToken");
        router.replace("/");
      }
    }
  };

  const renderForm = () => (
    <ScrollView>
      <View style={styles.formContainer}>
        <View style={styles.column}>
          <Input
            label={t("title")}
            value={title}
            onChangeText={setTitle}
            containerStyle={styles.inputContainer}
            disabled={mode === "edit"}
          />
          <Input
            label={t("description")}
            value={description}
            onChangeText={setDescription}
            multiline
            containerStyle={styles.inputContainer}
            disabled={mode === "edit"}
          />
          <View style={styles.dateContainer}>
            <Text style={styles.label}>{t("start_date")}</Text>
            <TouchableOpacity onPress={() => mode !== "edit" && setShowStartDatePicker(true)}>
              <Text style={[styles.dateText, mode === "edit" && styles.disabledText]}>
                {startDate.toLocaleDateString()}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.dateContainer}>
            <Text style={styles.label}>{t("end_date")}</Text>
            <TouchableOpacity onPress={() => setShowEndDatePicker(true)}>
              <Text style={styles.dateText}>{endDate.toLocaleDateString()}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.column}>
          <Input
            label={t("current")}
            value={current}
            onChangeText={setCurrent}
            keyboardType="numeric"
            containerStyle={styles.inputContainer}
          />
          {mode === "edit" && (
            <View style={styles.pickerContainer}>
              <Text style={styles.label}>{t("status")}</Text>
              <TouchableOpacity onPress={() => setShowStatusPicker(true)}>
                <Text style={styles.dateText}>{t(status.toLowerCase())}</Text>
              </TouchableOpacity>
            </View>
          )}
          <Input
            label={t("note")}
            value={note}
            onChangeText={setNote}
            multiline
            containerStyle={styles.inputContainer}
          />
        </View>
      </View>
      {mode === "edit" && goal?.goalHistory && (
        <View style={styles.historyContainer}>
          <Text style={styles.historyTitle}>{t("goal_history")}</Text>
          <View style={styles.historyTable}>
            <View style={styles.historyHeader}>
              <Text style={[styles.historyCell, styles.historyHeaderCell]}>{t("status")}</Text>
              <Text style={[styles.historyCell, styles.historyHeaderCell]}>{t("note")}</Text>
              <Text style={[styles.historyCell, styles.historyHeaderCell]}>{t("date")}</Text>
            </View>
            {goal.goalHistory.map((history: any) => (
              <View key={history.id} style={styles.historyRow}>
                <Text style={[styles.historyCell, styles.historyStatusCell]}>
                  {t(history.status.toLowerCase())}
                </Text>
                <Text style={styles.historyCell}>{history.note || "-"}</Text>
                <Text style={styles.historyCell}>
                  {new Date(history.updatedAt).toLocaleDateString()}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </ScrollView>
  );

  return (
    <>
      {mode === "edit" ? (
        <View style={styles.overlay}>
          <View style={styles.container}>
            <Text style={styles.title}>{screenTitle}</Text>
            {renderForm()}
            <View style={styles.buttonContainer}>
              <Button title={t("save")} onPress={handleSubmit} containerStyle={styles.button} />
              <Button title={t("close")} onPress={onClose} type="outline" containerStyle={styles.button} />
            </View>
          </View>
        </View>
      ) : (
        <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
          <View style={styles.overlay}>
            <View style={styles.container}>
              <Text style={styles.title}>{screenTitle}</Text>
              {renderForm()}
              <View style={styles.buttonContainer}>
                <Button title={t("save")} onPress={handleSubmit} containerStyle={styles.button} />
                <Button title={t("close")} onPress={onClose} type="outline" containerStyle={styles.button} />
              </View>
            </View>
          </View>
        </Modal>
      )}

      <Modal visible={showStartDatePicker} transparent>
        <View style={styles.datePickerModal}>
          <View style={styles.datePickerContainer}>
            <DateTimePicker
              value={startDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(event, selectedDate) => {
                setShowStartDatePicker(false);
                if (selectedDate) {
                  setStartDate(selectedDate);
                }
              }}
              minimumDate={new Date()}
            />
            {Platform.OS === 'android' && (
              <Button
                title={t("close")}
                onPress={() => setShowStartDatePicker(false)}
                type="outline"
                containerStyle={styles.datePickerButton}
              />
            )}
          </View>
        </View>
      </Modal>

      <Modal visible={showEndDatePicker} transparent>
        <View style={styles.datePickerModal}>
          <View style={styles.datePickerContainer}>
            <DateTimePicker
              value={endDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(event, selectedDate) => {
                setShowEndDatePicker(false);
                if (selectedDate) {
                  setEndDate(selectedDate);
                }
              }}
              minimumDate={startDate}
            />
            {Platform.OS === 'android' && (
              <Button
                title={t("close")}
                onPress={() => setShowEndDatePicker(false)}
                type="outline"
                containerStyle={styles.datePickerButton}
              />
            )}
          </View>
        </View>
      </Modal>

      <Modal visible={showStatusPicker} transparent>
        <View style={styles.datePickerModal}>
          <View style={styles.datePickerContainer}>
            <View style={styles.statusOptions}>
              <TouchableOpacity 
                style={[styles.statusOption, status === "TODO" && styles.selectedStatus]}
                onPress={() => {
                  setStatus("TODO");
                  setShowStatusPicker(false);
                }}
              >
                <Text style={[styles.statusText, status === "TODO" && styles.selectedStatusText]}>
                  {t("todo")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.statusOption, status === "IN_PROGRESS" && styles.selectedStatus]}
                onPress={() => {
                  setStatus("IN_PROGRESS");
                  setShowStatusPicker(false);
                }}
              >
                <Text style={[styles.statusText, status === "IN_PROGRESS" && styles.selectedStatusText]}>
                  {t("in_progress")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.statusOption, status === "DONE" && styles.selectedStatus]}
                onPress={() => {
                  setStatus("DONE");
                  setShowStatusPicker(false);
                }}
              >
                <Text style={[styles.statusText, status === "DONE" && styles.selectedStatusText]}>
                  {t("done")}
                </Text>
              </TouchableOpacity>
            </View>
            <Button
              title={t("close")}
              onPress={() => setShowStatusPicker(false)}
              type="outline"
              containerStyle={styles.datePickerButton}
            />
          </View>
        </View>
      </Modal>
    </>
  );
};

export default DoSomethingGoalDetails;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  container: {
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "90%",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  formContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  column: {
    flex: 1,
    marginHorizontal: 5,
  },
  inputContainer: {
    marginBottom: 15,
  },
  dateContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: "#86939e",
  },
  pickerContainer: {
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  button: {
    width: "45%",
  },
  datePickerModal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  datePickerContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "90%",
  },
  datePickerButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  datePickerButton: {
    width: "45%",
  },
  dateText: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 10,
  },
  statusOptions: {
    marginBottom: 20,
  },
  statusOption: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  selectedStatus: {
    backgroundColor: '#e3f2fd',
  },
  statusText: {
    fontSize: 16,
    color: '#000',
  },
  selectedStatusText: {
    color: '#1976d2',
    fontWeight: 'bold',
  },
  disabledText: {
    color: '#999',
    backgroundColor: '#f5f5f5',
  },
  historyContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  historyTable: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  historyHeader: {
    flexDirection: 'row',
    backgroundColor: '#e0e0e0',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  historyRow: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: 'white',
  },
  historyCell: {
    flex: 1,
    padding: 5,
    fontSize: 14,
  },
  historyHeaderCell: {
    fontWeight: 'bold',
    color: '#333',
  },
  historyStatusCell: {
    textTransform: 'capitalize',
  },
});