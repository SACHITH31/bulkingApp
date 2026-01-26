import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    FlatList,
    Keyboard,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function WeightScreen() {
  const [currentWeight, setCurrentWeight] = useState("");
  const [history, setHistory] = useState([
    { id: "1", date: "Jan 25", weight: "54.0" },
  ]);

  const targetWeight = 63; // Your Goal

  const addWeight = () => {
    if (currentWeight) {
      const newEntry = {
        id: Math.random().toString(),
        date: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        weight: currentWeight,
      };
      setHistory([newEntry, ...history]);
      setCurrentWeight("");
      Keyboard.dismiss();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Weight Tracker</Text>

      {/* Target Card */}
      <View style={styles.targetCard}>
        <View>
          <Text style={styles.targetLabel}>Current Goal</Text>
          <Text style={styles.targetValue}>{targetWeight} kg</Text>
        </View>
        <Feather name="target" size={40} color="#34C759" />
      </View>

      {/* Input Section */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter Weight (kg)"
          placeholderTextColor="#666"
          keyboardType="numeric"
          value={currentWeight}
          onChangeText={setCurrentWeight}
        />
        <TouchableOpacity style={styles.addBtn} onPress={addWeight}>
          <Text style={styles.addBtnText}>Log Weight</Text>
        </TouchableOpacity>
      </View>

      {/* History List */}
      <Text style={styles.historyTitle}>Progress History</Text>
      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.historyRow}>
            <Text style={styles.historyDate}>{item.date}</Text>
            <Text style={styles.historyWeight}>{item.weight} kg</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", padding: 20 },
  headerTitle: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  targetCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1C1C1E",
    padding: 20,
    borderRadius: 15,
    marginBottom: 25,
  },
  targetLabel: { color: "#8E8E93", fontSize: 14 },
  targetValue: { color: "white", fontSize: 32, fontWeight: "bold" },
  inputContainer: { flexDirection: "row", marginBottom: 30 },
  input: {
    flex: 1,
    backgroundColor: "#1C1C1E",
    borderRadius: 10,
    paddingHorizontal: 15,
    color: "white",
    fontSize: 16,
    marginRight: 10,
  },
  addBtn: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    justifyContent: "center",
  },
  addBtnText: { color: "white", fontWeight: "bold" },
  historyTitle: {
    color: "#8E8E93",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 15,
  },
  historyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: "#333",
  },
  historyDate: { color: "#8E8E93", fontSize: 16 },
  historyWeight: { color: "white", fontSize: 16, fontWeight: "bold" },
});
