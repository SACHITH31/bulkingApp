import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function WeightScreen({
  onWeightUpdate,
}: {
  onWeightUpdate: (w: string) => void;
}) {
  const [currentInput, setCurrentInput] = useState("");
  const [history, setHistory] = useState([]);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  const targetWeight = 63; // Your Goal

  useEffect(() => {
    loadWeights();
  }, []);

  const loadWeights = async () => {
    try {
      const saved = await AsyncStorage.getItem("@weight_history");
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        setHistory(parsed);
        // Fallback to 54 if history is cleared
        onWeightUpdate(parsed.length > 0 ? parsed[0].weight : "54");
      } else {
        onWeightUpdate("54");
      }
    } catch (e) {
      onWeightUpdate("54");
    }
  };

  const saveWeights = async (data: any) => {
    try {
      await AsyncStorage.setItem("@weight_history", JSON.stringify(data));
    } catch (e) {
      console.log("Save error");
    }
  };

  const addWeight = () => {
    if (!currentInput || isNaN(parseFloat(currentInput))) return;
    const newEntry = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      weight: currentInput,
    };
    const newHistory = [newEntry, ...history];
    setHistory(newHistory);
    saveWeights(newHistory);
    onWeightUpdate(currentInput);
    setCurrentInput("");
    Keyboard.dismiss();
  };

  const deleteSelected = () => {
    const newHistory = history.filter(
      (item) => !selectedItems.includes(item.id),
    );
    setHistory(newHistory);
    saveWeights(newHistory);
    setSelectedItems([]);
    setIsDeleteMode(false);

    // Reset header to 54 if history is empty
    onWeightUpdate(newHistory.length > 0 ? newHistory[0].weight : "54");
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>Weight Tracker</Text>
        <TouchableOpacity
          onPress={() => {
            setIsDeleteMode(!isDeleteMode);
            setSelectedItems([]);
          }}
        >
          <Text style={[styles.editBtn, isDeleteMode && { color: "#FF3B30" }]}>
            {isDeleteMode ? "Cancel" : "Delete"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Current Weight</Text>
          <Text style={styles.statValue}>
            {history.length > 0 ? history[0].weight : "54"}
            <Text style={styles.unit}> kg</Text>
          </Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Target Goal</Text>
          <Text style={[styles.statValue, { color: "#34C759" }]}>
            {targetWeight} <Text style={styles.unit}> kg</Text>
          </Text>
        </View>
      </View>

      {!isDeleteMode ? (
        <View style={styles.inputBox}>
          <TextInput
            style={styles.input}
            placeholder="Log weight (e.g. 54.5)"
            placeholderTextColor="#666"
            keyboardType="numeric"
            value={currentInput}
            onChangeText={setCurrentInput}
          />
          <TouchableOpacity style={styles.addBtn} onPress={addWeight}>
            <Feather name="plus" size={24} color="white" />
          </TouchableOpacity>
        </View>
      ) : (
        selectedItems.length > 0 && (
          <TouchableOpacity style={styles.deleteBar} onPress={deleteSelected}>
            <Text style={styles.deleteBarText}>
              Delete All Selected ({selectedItems.length})
            </Text>
          </TouchableOpacity>
        )
      )}

      <Text style={styles.historyTitle}>PROGRESS HISTORY</Text>
      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.historyRow}
            onPress={() => {
              if (isDeleteMode) {
                selectedItems.includes(item.id)
                  ? setSelectedItems(selectedItems.filter((i) => i !== item.id))
                  : setSelectedItems([...selectedItems, item.id]);
              }
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {isDeleteMode && (
                <View
                  style={[
                    styles.checkbox,
                    selectedItems.includes(item.id) && styles.checked,
                  ]}
                >
                  {selectedItems.includes(item.id) && (
                    <Feather name="check" size={12} color="white" />
                  )}
                </View>
              )}
              <Text style={styles.historyDate}>{item.date}</Text>
            </View>
            <Text style={styles.historyWeight}>{item.weight} kg</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", paddingHorizontal: 20 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 20,
  },
  headerTitle: { color: "white", fontSize: 26, fontWeight: "bold" },
  editBtn: { color: "#007AFF", fontSize: 16, fontWeight: "600" },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
  },
  statCard: {
    backgroundColor: "#1C1C1E",
    width: "48%",
    padding: 18,
    borderRadius: 16,
  },
  statLabel: { color: "#8E8E93", fontSize: 12, marginBottom: 8 },
  statValue: { color: "white", fontSize: 28, fontWeight: "bold" },
  unit: { fontSize: 14, color: "#666" },
  inputBox: { flexDirection: "row", marginBottom: 25 },
  input: {
    flex: 1,
    backgroundColor: "#1C1C1E",
    borderRadius: 12,
    padding: 15,
    color: "white",
    marginRight: 12,
  },
  addBtn: {
    backgroundColor: "#007AFF",
    width: 56,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteBar: {
    backgroundColor: "#FF3B30",
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: "center",
  },
  deleteBarText: { color: "white", fontWeight: "bold" },
  historyTitle: {
    color: "#666",
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 15,
  },
  historyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 18,
    borderBottomWidth: 0.5,
    borderBottomColor: "#222",
  },
  historyDate: { color: "#FFF", fontSize: 17 },
  historyWeight: { color: "#8E8E93", fontSize: 17 },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#444",
    marginRight: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  checked: { backgroundColor: "#FF3B30", borderColor: "#FF3B30" },
});
