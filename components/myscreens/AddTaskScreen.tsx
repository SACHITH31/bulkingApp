import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function AddTaskScreen({ navigation }: any) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [todos, setTodos] = useState([
    { id: Date.now().toString(), name: "", description: "" },
  ]);

  const addNewTodoField = () => {
    setTodos([
      ...todos,
      { id: Date.now().toString(), name: "", description: "" },
    ]);
  };

  const updateTodo = (index: number, field: string, value: string) => {
    const updatedTodos = [...todos];
    updatedTodos[index] = { ...updatedTodos[index], [field]: value };
    setTodos(updatedTodos);
  };

  const saveTaskGroup = async () => {
    if (!title || !date) {
      Alert.alert("Error", "Please enter a Title and Date");
      return;
    }

    try {
      const existingTasks = await AsyncStorage.getItem("@task_groups");
      const tasks = existingTasks ? JSON.parse(existingTasks) : [];

      const newGroup = {
        id: Date.now().toString(),
        title,
        date,
        todos: todos.filter((t) => t.name !== ""), // Only save todos that have a name
      };

      const updatedTasks = [newGroup, ...tasks];
      await AsyncStorage.setItem("@task_groups", JSON.stringify(updatedTasks));

      Alert.alert("Success", "Task Group Saved!");
      // Reset form
      setTitle("");
      setDate("");
      setTodos([{ id: Date.now().toString(), name: "", description: "" }]);
    } catch (e) {
      Alert.alert("Error", "Failed to save tasks");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>New Task Group</Text>

      <Text style={styles.label}>Main Title</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Project Alpha"
        placeholderTextColor="#666"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Date</Text>
      <TextInput
        style={styles.input}
        placeholder="Jan 26, 2026"
        placeholderTextColor="#666"
        value={date}
        onChangeText={setDate}
      />

      <Text style={styles.sectionTitle}>NESTED TODOS</Text>

      {todos.map((todo, index) => (
        <View key={todo.id} style={styles.todoBox}>
          <TextInput
            style={styles.todoName}
            placeholder="Todo Name (e.g. Buy milk)"
            placeholderTextColor="#888"
            value={todo.name}
            onChangeText={(text) => updateTodo(index, "name", text)}
          />
          <TextInput
            style={styles.todoDesc}
            placeholder="Description (optional)"
            placeholderTextColor="#666"
            multiline
            value={todo.description}
            onChangeText={(text) => updateTodo(index, "description", text)}
          />
        </View>
      ))}

      <TouchableOpacity style={styles.addTodoBtn} onPress={addNewTodoField}>
        <Feather name="plus-circle" size={20} color="#007AFF" />
        <Text style={styles.addTodoText}>Add Another Todo</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.saveBtn} onPress={saveTaskGroup}>
        <Text style={styles.saveBtnText}>Save Task Group</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", padding: 20 },
  header: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 40,
  },
  label: { color: "#8E8E93", fontSize: 14, marginBottom: 8, marginTop: 15 },
  input: {
    backgroundColor: "#1C1C1E",
    color: "white",
    padding: 15,
    borderRadius: 12,
    fontSize: 16,
  },
  sectionTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 30,
    marginBottom: 10,
  },
  todoBox: {
    backgroundColor: "#1C1C1E",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: "#007AFF",
  },
  todoName: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
  },
  todoDesc: { color: "#8E8E93", fontSize: 14 },
  addTodoBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    padding: 10,
  },
  addTodoText: {
    color: "#007AFF",
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "600",
  },
  saveBtn: {
    backgroundColor: "#34C759",
    padding: 18,
    borderRadius: 15,
    marginTop: 40,
    alignItems: "center",
    marginBottom: 100,
  },
  saveBtnText: { color: "white", fontSize: 18, fontWeight: "bold" },
});
