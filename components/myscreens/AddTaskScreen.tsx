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

interface TodoItem {
  id: string;
  name: string;
  description: string;
}

export default function AddTaskScreen({ onGoBack, editTask }: any) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  // State handles both name and description for each todo
  const [todos, setTodos] = useState<TodoItem[]>([
    { id: Date.now().toString(), name: "", description: "" },
  ]);

  useEffect(() => {
    if (editTask) {
      setTitle(editTask.title);
      setDate(new Date(editTask.date));
      setTodos(editTask.todos);
    }
  }, [editTask]);

  const onChangeDate = (event: any, selectedDate?: Date) => {
    setShowPicker(false);
    if (selectedDate) setDate(selectedDate);
  };

  const addNewTodoField = () => {
    setTodos([
      ...todos,
      { id: Date.now().toString(), name: "", description: "" },
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

  const saveTaskGroup = async () => {
    if (!title.trim()) {
      Alert.alert("Required", "Please enter a Group Title");
      return;
    }

    try {
      const existing = await AsyncStorage.getItem("@task_groups");
      let tasks = existing ? JSON.parse(existing) : [];

      const taskData = {
        id: editTask ? editTask.id : Date.now().toString(),
        title,
        date: date.toISOString(),
        todos: todos.filter((t) => t.name.trim() !== ""), // Only saves items with a name
        completed: editTask ? editTask.completed : false,
      };

      if (editTask) {
        tasks = tasks.map((t: any) => (t.id === editTask.id ? taskData : t));
      } else {
        tasks = [taskData, ...tasks];
      }

      await AsyncStorage.setItem("@task_groups", JSON.stringify(tasks));

      // Points 4: Success message and redirect to Home
      Alert.alert("Success", "Task Group saved successfully!", [
        { text: "OK", onPress: () => onGoBack() },
      ]);
    } catch (e) {
      Alert.alert("Error", "Could not save task");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Adjusted Gap: Internal header for context */}
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
          onPress={() => setShowPicker(true)}
        >
          <Feather name="calendar" size={18} color="#007AFF" />
          <Text style={styles.dateText}>{date.toDateString()}</Text>
        </TouchableOpacity>

        {showPicker && (
          <DateTimePicker value={date} mode="date" onChange={onChangeDate} />
        )}

        <Text style={styles.subLabel}>NESTED TODOS</Text>

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
              {todos.length > 1 && (
                <TouchableOpacity onPress={() => removeTodoField(index)}>
                  <Feather name="minus-circle" size={18} color="#FF3B30" />
                </TouchableOpacity>
              )}
            </View>

            {/* Point 2 & 3: Description Implementation */}
            <TextInput
              style={styles.todoDescInput}
              placeholder="Description (Optional)"
              placeholderTextColor="#444"
              multiline
              value={todo.description}
              onChangeText={(v) => updateTodo(index, "description", v)}
            />
          </View>
        ))}

        <TouchableOpacity style={styles.addBtn} onPress={addNewTodoField}>
          <Feather name="plus" size={18} color="#007AFF" />
          <Text style={styles.addBtnText}>Add Item</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.confirmBtn} onPress={saveTaskGroup}>
          <Text style={styles.confirmBtnText}>Confirm Task</Text>
        </TouchableOpacity>

        {/* Extra space so keyboard doesn't cover the button */}
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
