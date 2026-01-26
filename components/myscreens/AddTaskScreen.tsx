import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useEffect, useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function AddTaskScreen({ onGoBack, editTask }: any) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [todos, setTodos] = useState([
    { id: Date.now().toString(), name: "", description: "" },
  ]);

  // If we are editing, fill the fields with existing data
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

  const saveTaskGroup = async () => {
    if (!title.trim()) {
      Alert.alert("Required", "Please enter a title");
      return;
    }

    try {
      const existing = await AsyncStorage.getItem("@task_groups");
      let tasks = existing ? JSON.parse(existing) : [];

      const taskData = {
        id: editTask ? editTask.id : Date.now().toString(),
        title,
        date: date.toISOString(), // Standard format for perfect filtering
        todos: todos.filter((t) => t.name.trim() !== ""),
        completed: editTask ? editTask.completed : false,
      };

      if (editTask) {
        tasks = tasks.map((t: any) => (t.id === editTask.id ? taskData : t));
      } else {
        tasks = [taskData, ...tasks];
      }

      await AsyncStorage.setItem("@task_groups", JSON.stringify(tasks));
      onGoBack();
    } catch (e) {
      Alert.alert("Error", "Could not save");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={onGoBack} style={styles.backBtn}>
        <Feather name="x" size={24} color="white" />
      </TouchableOpacity>

      <Text style={styles.header}>{editTask ? "Edit Task" : "New Task"}</Text>

      <TextInput
        style={styles.input}
        placeholder="Group Title"
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

      <Text style={styles.subHeader}>NESTED TODOS</Text>
      {todos.map((todo, index) => (
        <View key={todo.id} style={styles.todoCard}>
          <TextInput
            style={styles.todoInput}
            placeholder="Todo Name"
            placeholderTextColor="#666"
            value={todo.name}
            onChangeText={(v) => {
              const newTodos = [...todos];
              newTodos[index].name = v;
              setTodos(newTodos);
            }}
          />
        </View>
      ))}

      <TouchableOpacity
        style={styles.addMore}
        onPress={() =>
          setTodos([
            ...todos,
            { id: Date.now().toString(), name: "", description: "" },
          ])
        }
      >
        <Feather name="plus" size={20} color="#007AFF" />
        <Text style={{ color: "#007AFF", marginLeft: 8 }}>Add Item</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.saveBtn} onPress={saveTaskGroup}>
        <Text style={styles.saveText}>Confirm Task</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", padding: 20 },
  backBtn: { marginTop: 40, marginBottom: 20 },
  header: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
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
  subHeader: {
    color: "#666",
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 15,
  },
  todoCard: {
    backgroundColor: "#1C1C1E",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#007AFF",
  },
  todoInput: { color: "white", fontSize: 16 },
  addMore: { flexDirection: "row", alignItems: "center", padding: 10 },
  saveBtn: {
    backgroundColor: "#007AFF",
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 30,
    marginBottom: 100,
  },
  saveText: { color: "white", fontSize: 18, fontWeight: "bold" },
});
