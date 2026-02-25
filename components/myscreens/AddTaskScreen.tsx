import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  registerForPushNotificationsAsync,
  syncAllNotifications,
} from "../../utils/notifications";

interface TodoItem {
  id: string;
  name: string;
  description: string;
  time: string;
}

const createTodoId = () =>
  `${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

export default function AddTaskScreen({ onGoBack, editTask }: any) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [activeTodoIndex, setActiveTodoIndex] = useState<number | null>(null);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const [todos, setTodos] = useState<TodoItem[]>([
    {
      id: createTodoId(),
      name: "",
      description: "",
      time: new Date().toISOString(),
    },
  ]);

  useEffect(() => {
    registerForPushNotificationsAsync();
    if (editTask) {
      setTitle(editTask.title);
      setDate(new Date(editTask.date));
      setTodos(editTask.todos);
    }
  }, [editTask]);

  const onChangeDate = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const pickedDate = new Date(selectedDate);
      pickedDate.setHours(0, 0, 0, 0);

      if (pickedDate < today) {
        Alert.alert(
          "Invalid Date",
          "You cannot schedule tasks for past dates.",
        );
        setDate(new Date());
      } else {
        setDate(selectedDate);
      }
    }
  };

  const onChangeTodoTime = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime && activeTodoIndex !== null) {
      const updatedTodos = [...todos];
      // IMPORTANT: Ensure the time is merged with the currently selected date
      const combined = new Date(date);
      combined.setHours(selectedTime.getHours());
      combined.setMinutes(selectedTime.getMinutes());
      combined.setSeconds(0, 0);

      updatedTodos[activeTodoIndex].time = combined.toISOString();
      setTodos(updatedTodos);
      setActiveTodoIndex(null);
    }
  };

  const addNewTodoField = () => {
    const defaultTime = new Date(date);
    defaultTime.setSeconds(0, 0);
    setTodos([
      ...todos,
        {
        id: createTodoId(),
        name: "",
        description: "",
        time: defaultTime.toISOString(),
      },
    ]);
  };

  const updateTodo = (index: number, field: keyof TodoItem, value: string) => {
    const updatedTodos = [...todos];
    updatedTodos[index] = { ...updatedTodos[index], [field]: value };
    setTodos(updatedTodos);
  };

  const removeTodoField = (index: number) => {
    if (todos.length > 1) {
      const updated = todos.filter((_, i) => i !== index);
      setTodos(updated);
    }
  };

  const performSave = async (filteredTodos: TodoItem[], finalDate: Date) => {
    try {
      const existing = await AsyncStorage.getItem("@task_groups");
      let tasks = existing ? JSON.parse(existing) : [];

      // Normalize all todo times to match the finalDate chosen
      const seenIds = new Set<string>();
      const normalizedTodos = filteredTodos.map((todo) => {
        const t = new Date(todo.time);
        const corrected = new Date(finalDate);
        corrected.setHours(t.getHours());
        corrected.setMinutes(t.getMinutes());
        corrected.setSeconds(0, 0);
        const baseId = todo.id?.trim() || createTodoId();
        const finalId = seenIds.has(baseId) ? createTodoId() : baseId;
        seenIds.add(finalId);
        return { ...todo, id: finalId, time: corrected.toISOString() };
      });

      const taskData = {
        id: editTask ? editTask.id : Date.now().toString(),
        title,
        date: finalDate.toISOString(),
        todos: normalizedTodos,
        completed: editTask ? editTask.completed : false,
      };

      if (editTask) {
        tasks = tasks.map((t: any) => (t.id === editTask.id ? taskData : t));
      } else {
        tasks = [taskData, ...tasks];
      }

      await AsyncStorage.setItem("@task_groups", JSON.stringify(tasks));

      // Refresh the notification engine
      await syncAllNotifications();
      onGoBack();
    } catch (e: any) {
      Alert.alert("Error", e.message || "Could not save task.");
    }
  };

  const saveTaskGroup = async () => {
    if (!title.trim()) {
      Alert.alert("Required", "Please enter a Group Title");
      return;
    }

    const now = new Date();
    const filteredTodos = todos.filter((t) => t.name.trim() !== "");
    let containsPastTime = false;

    const isToday = date.toDateString() === now.toDateString();

    if (isToday) {
      for (const item of filteredTodos) {
        const itemTime = new Date(item.time);
        if (itemTime <= now) {
          containsPastTime = true;
          break;
        }
      }
    }

    if (containsPastTime) {
      Alert.alert(
        "Time Already Passed",
        "Some selected times have already passed. Move this task to tomorrow?",
        [
          { text: "Change Time", style: "cancel" },
          {
            text: "Set for Tomorrow",
            onPress: () => {
              const tomorrow = new Date(date);
              tomorrow.setDate(tomorrow.getDate() + 1);
              performSave(filteredTodos, tomorrow);
            },
          },
        ],
      );
    } else {
      performSave(filteredTodos, date);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.internalTitle}>
          {editTask ? "Edit Task" : "New Task"}
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Group Title (e.g. Morning Workout)"
          placeholderTextColor="#666"
          value={title}
          onChangeText={setTitle}
        />

        <TouchableOpacity
          style={styles.datePickerBtn}
          onPress={() => setShowDatePicker(true)}
        >
          <Feather name="calendar" size={18} color="#007AFF" />
          <Text style={styles.dateText}>{date.toDateString()}</Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            onChange={onChangeDate}
            minimumDate={new Date()}
          />
        )}

        <Text style={styles.subLabel}>NESTED TODOS (SET TIME FOR ALERTS)</Text>

        {todos.map((todo, index) => (
          <View key={todo.id} style={styles.todoCard}>
            <View style={styles.todoHeaderRow}>
              <TextInput
                style={styles.todoNameInput}
                placeholder="Todo Name"
                placeholderTextColor="#666"
                value={todo.name}
                onChangeText={(v) => updateTodo(index, "name", v)}
              />
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TouchableOpacity
                  onPress={() => {
                    setActiveTodoIndex(index);
                    setShowTimePicker(true);
                  }}
                  style={{ marginRight: 15 }}
                >
                  <Feather name="clock" size={18} color="#007AFF" />
                </TouchableOpacity>
                {todos.length > 1 && (
                  <TouchableOpacity onPress={() => removeTodoField(index)}>
                    <Feather name="minus-circle" size={18} color="#FF3B30" />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            <TextInput
              style={styles.todoDescInput}
              placeholder="Description (Optional)"
              placeholderTextColor="#444"
              multiline
              value={todo.description}
              onChangeText={(v) => updateTodo(index, "description", v)}
            />

            <Text
              style={{
                color: "#007AFF",
                fontSize: 12,
                marginTop: 5,
                fontWeight: "500",
              }}
            >
              🔔 Reminder set for:{" "}
              {new Date(todo.time).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </View>
        ))}

        {showTimePicker && (
          <DateTimePicker
            value={
              activeTodoIndex !== null
                ? new Date(todos[activeTodoIndex].time)
                : new Date()
            }
            mode="time"
            onChange={onChangeTodoTime}
          />
        )}

        <TouchableOpacity style={styles.addBtn} onPress={addNewTodoField}>
          <Feather name="plus" size={18} color="#007AFF" />
          <Text style={styles.addBtnText}>Add Item</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.confirmBtn} onPress={saveTaskGroup}>
          <Text style={styles.confirmBtnText}>Confirm Task</Text>
        </TouchableOpacity>

        <View style={{ height: 120 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", paddingHorizontal: 20 },
  internalTitle: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#1C1C1E",
    color: "white",
    padding: 18,
    borderRadius: 15,
    fontSize: 16,
    marginBottom: 15,
  },
  datePickerBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1C1C1E",
    padding: 18,
    borderRadius: 15,
    marginBottom: 25,
  },
  dateText: { color: "white", marginLeft: 12, fontSize: 16 },
  subLabel: {
    color: "#8E8E93",
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 15,
    textTransform: "uppercase",
  },
  todoCard: {
    backgroundColor: "#1C1C1E",
    padding: 15,
    borderRadius: 15,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#007AFF",
  },
  todoHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  todoNameInput: { color: "white", fontSize: 16, fontWeight: "600", flex: 1 },
  todoDescInput: {
    color: "#888",
    fontSize: 14,
    marginTop: 10,
    borderTopWidth: 0.5,
    borderTopColor: "#333",
    paddingTop: 8,
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    marginBottom: 20,
  },
  addBtnText: { color: "#007AFF", marginLeft: 8, fontWeight: "600" },
  confirmBtn: {
    backgroundColor: "#007AFF",
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 10,
  },
  confirmBtnText: { color: "white", fontSize: 18, fontWeight: "bold" },
});
