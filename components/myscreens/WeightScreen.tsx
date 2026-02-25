import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type WeightLog = {
  id: string;
  date: string;
  amount: string;
};

type WeightScreenProps = {
  onWeightUpdate: (newW: string) => void;
};

export default function WeightScreen({ onWeightUpdate }: WeightScreenProps) {
  const [currentInput, setCurrentInput] = useState("");
  const [history, setHistory] = useState<WeightLog[]>([]);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const BASE_WEIGHT = 54; //
  const targetWeight = 63; //

  const calculateTotalWeight = (logs: WeightLog[]) => {
    // Math safety check: only add valid numbers
    const gained = logs.reduce((sum, item) => {
      const val = parseFloat(item.amount);
      return isNaN(val) ? sum : sum + val;
    }, 0);
    return (BASE_WEIGHT + gained).toFixed(2);
  };

  const loadWeights = useCallback(async () => {
    try {
      const saved = await AsyncStorage.getItem("@weight_history");
      if (saved !== null) {
        const parsed = JSON.parse(saved) as WeightLog[];
        setHistory(parsed);
        onWeightUpdate(calculateTotalWeight(parsed));
      } else {
        onWeightUpdate(BASE_WEIGHT.toString());
      }
    } catch {
      onWeightUpdate(BASE_WEIGHT.toString());
    }
  }, [onWeightUpdate]);

  useEffect(() => {
    loadWeights();
  }, [loadWeights]);

  const saveWeights = async (data: WeightLog[]) => {
    try {
      await AsyncStorage.setItem("@weight_history", JSON.stringify(data));
    } catch {
      console.log("Save error");
    }
  };

  const addWeight = () => {
    // SAFETY CHECK: Prevents NaN if input is empty or just a dot
    if (!currentInput || isNaN(parseFloat(currentInput))) {
      Alert.alert("Error", "Please enter a weight amount first.");
      return;
    }

    const newEntry = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      amount: currentInput,
    };

    const newHistory = [newEntry, ...history];
    setHistory(newHistory);
    saveWeights(newHistory);
    onWeightUpdate(calculateTotalWeight(newHistory));
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
    onWeightUpdate(calculateTotalWeight(newHistory));
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
            {calculateTotalWeight(history)}
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
            placeholder="Add weight (e.g. 0.25)"
            placeholderTextColor="#666"
            keyboardType="decimal-pad" // Better for weights with dots
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
              Delete Selected ({selectedItems.length})
            </Text>
          </TouchableOpacity>
        )
      )}

      <Text style={styles.historyTitle}>GAINS HISTORY</Text>
      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.historyRow}
            onPress={() => {
              if (isDeleteMode) {
                if (selectedItems.includes(item.id)) {
                  setSelectedItems(selectedItems.filter((i) => i !== item.id));
                } else {
                  setSelectedItems([...selectedItems, item.id]);
                }
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
            <Text style={styles.historyWeight}>+{item.amount} kg</Text>
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
  historyWeight: { color: "#34C759", fontSize: 17, fontWeight: "bold" },
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
