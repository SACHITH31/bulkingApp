import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { syncAllNotifications } from "../../utils/notifications";

export default function FoodScreen() {
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [activePeriodIndex, setActivePeriodIndex] = useState<number | null>(
    null,
  );

  const [newName, setNewName] = useState("");
  const [newKcal, setNewKcal] = useState("");
  const [newPro, setNewPro] = useState("");

  const [dietPlan, setDietPlan] = useState([
    {
      period: "After Bed",
      time: "5:00 AM",
      items: [
        {
          id: 1,
          name: "1 Glass Water",
          kcal: 0,
          pro: 0,
          done: false,
          optional: false,
        },
      ],
    },
    {
      period: "Breakfast",
      time: "7:30 AM",
      items: [
        {
          id: 2,
          name: "Milk (250ml)",
          kcal: 150,
          pro: 8,
          done: false,
          optional: false,
        },
        {
          id: 3,
          name: "1 Banana",
          kcal: 100,
          pro: 1,
          done: false,
          optional: false,
        },
        {
          id: 4,
          name: "10 Almonds",
          kcal: 70,
          pro: 2,
          done: false,
          optional: false,
        },
        {
          id: 5,
          name: "40g Oats (Optional)",
          kcal: 150,
          pro: 5,
          done: false,
          optional: true,
        },
      ],
    },
    {
      period: "College Snack",
      time: "10:40 AM",
      items: [
        {
          id: 6,
          name: "1 Fruit",
          kcal: 80,
          pro: 1,
          done: false,
          optional: false,
        },
        {
          id: 7,
          name: "20g Peanuts (Optional)",
          kcal: 115,
          pro: 5,
          done: false,
          optional: true,
        },
      ],
    },
    {
      period: "Lunch",
      time: "1:00 PM",
      items: [
        {
          id: 8,
          name: "Rice (Large Portion)",
          kcal: 350,
          pro: 6,
          done: false,
          optional: false,
        },
        {
          id: 9,
          name: "Channa Dal",
          kcal: 180,
          pro: 12,
          done: false,
          optional: false,
        },
        {
          id: 10,
          name: "1 tsp Ghee",
          kcal: 90,
          pro: 0,
          done: false,
          optional: false,
        },
        {
          id: 11,
          name: "Salad",
          kcal: 40,
          pro: 1,
          done: false,
          optional: false,
        },
      ],
    },
    {
      period: "Evening Snack",
      time: "4:30 PM",
      items: [
        {
          id: 12,
          name: "1 Banana",
          kcal: 100,
          pro: 1,
          done: false,
          optional: false,
        },
        {
          id: 13,
          name: "30g Roasted Chana",
          kcal: 110,
          pro: 6,
          done: false,
          optional: false,
        },
      ],
    },
    {
      period: "Evening Shake",
      time: "6:00 PM",
      items: [
        {
          id: 14,
          name: "Milk (250ml)",
          kcal: 150,
          pro: 8,
          done: false,
          optional: false,
        },
        {
          id: 15,
          name: "1 Banana",
          kcal: 100,
          pro: 1,
          done: false,
          optional: false,
        },
        {
          id: 16,
          name: "1 tbsp Peanut Butter",
          kcal: 90,
          pro: 4,
          done: false,
          optional: false,
        },
        {
          id: 17,
          name: "Oats (Optional)",
          kcal: 100,
          pro: 3,
          done: false,
          optional: true,
        },
      ],
    },
    {
      period: "Dinner",
      time: "7:30 PM",
      items: [
        {
          id: 18,
          name: "Rice",
          kcal: 300,
          pro: 5,
          done: false,
          optional: false,
        },
        {
          id: 19,
          name: "Dal",
          kcal: 180,
          pro: 12,
          done: false,
          optional: false,
        },
        {
          id: 20,
          name: "Milk",
          kcal: 150,
          pro: 8,
          done: false,
          optional: false,
        },
      ],
    },
    {
      period: "Before Bed",
      time: "9:30 PM",
      items: [
        {
          id: 21,
          name: "1 Glass Milk",
          kcal: 130,
          pro: 6,
          done: false,
          optional: false,
        },
      ],
    },
  ]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const todayDate = new Date().toDateString();
      const savedDate = await AsyncStorage.getItem("@last_food_date");
      const savedPlan = await AsyncStorage.getItem("@diet_plan_state");

      if (savedDate !== todayDate) {
        await AsyncStorage.setItem("@last_food_date", todayDate);
        await AsyncStorage.removeItem("@diet_plan_state");
        await AsyncStorage.removeItem("@daily_summary");
      } else if (savedPlan) {
        setDietPlan(JSON.parse(savedPlan));
      }
    } catch (e) {
      console.log("Error loading food data");
    } finally {
      setLoading(false);
    }
  };

  const saveData = async (updatedPlan: any) => {
    try {
      await AsyncStorage.setItem(
        "@diet_plan_state",
        JSON.stringify(updatedPlan),
      );

      const allItems = updatedPlan.flatMap((p: any) => p.items);
      const totalKcal = allItems.reduce(
        (sum: number, i: any) => (i.done ? sum + i.kcal : sum),
        0,
      );
      const totalPro = allItems.reduce(
        (sum: number, i: any) => (i.done ? sum + i.pro : sum),
        0,
      );

      const summary = {
        kcal: totalKcal,
        protein: totalPro,
        date: new Date().toDateString(),
      };
      await AsyncStorage.setItem("@daily_summary", JSON.stringify(summary));

      // This ensures your 10:30 PM notification is always accurate!
      await syncAllNotifications();
    } catch (e) {
      console.log("Error saving food data");
    }
  };

  const toggleItem = (periodIndex: number, itemId: number) => {
    const updatedPlan = [...dietPlan];
    const item = updatedPlan[periodIndex].items.find((i) => i.id === itemId);
    if (item) {
      item.done = !item.done;
      setDietPlan(updatedPlan);
      saveData(updatedPlan);
    }
  };

  const addCustomFood = () => {
    if (!newName.trim() || activePeriodIndex === null) return;

    const updatedPlan = [...dietPlan];
    const newItem = {
      id: Date.now() + Math.random(),
      name: newName,
      kcal: parseInt(newKcal) || 0,
      pro: parseInt(newPro) || 0,
      done: true,
      optional: false,
    };

    updatedPlan[activePeriodIndex].items.push(newItem);
    setDietPlan(updatedPlan);
    saveData(updatedPlan);

    // Minor stability fixes: Reset and close modal
    setNewName("");
    setNewKcal("");
    setNewPro("");
    setModalVisible(false);
  };

  const allItems = dietPlan.flatMap((p) => p.items);
  const currentKcal = allItems.reduce(
    (sum, i) => (i.done ? sum + i.kcal : sum),
    0,
  );
  const currentPro = allItems.reduce(
    (sum, i) => (i.done ? sum + i.pro : sum),
    0,
  );

  if (loading)
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );

  return (
    <View style={styles.container}>
      <View style={styles.statContainer}>
        <View style={styles.statBox}>
          <View style={styles.labelRow}>
            <Text style={styles.statLabel}>Calories</Text>
            <Text style={styles.statValue}>{currentKcal}/2600 kcal</Text>
          </View>
          <View style={styles.barBg}>
            <View
              style={[
                styles.barFill,
                {
                  width: `${Math.min((currentKcal / 2600) * 100, 100)}%`,
                  backgroundColor: "#FF9500",
                },
              ]}
            />
          </View>
        </View>
        <View style={styles.statBox}>
          <View style={styles.labelRow}>
            <Text style={styles.statLabel}>Protein</Text>
            <Text style={styles.statValue}>{currentPro}g/95g</Text>
          </View>
          <View style={styles.barBg}>
            <View
              style={[
                styles.barFill,
                {
                  width: `${Math.min((currentPro / 95) * 100, 100)}%`,
                  backgroundColor: "#34C759",
                },
              ]}
            />
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {dietPlan.map((section, pIdx) => (
          <View key={pIdx} style={styles.sectionWrapper}>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionTitle}>{section.period}</Text>
                <Text style={styles.sectionTime}>{section.time}</Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  setActivePeriodIndex(pIdx);
                  setModalVisible(true);
                }}
              >
                <Feather name="edit-3" size={20} color="#007AFF" />
              </TouchableOpacity>
            </View>

            {section.items.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.itemRow}
                onPress={() => toggleItem(pIdx, item.id)}
              >
                <View style={[styles.checkbox, item.done && styles.checked]}>
                  {item.done && (
                    <Feather name="check" size={14} color="white" />
                  )}
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      styles.itemName,
                      item.done && styles.strikethrough,
                      item.optional && { color: "#8E8E93" },
                    ]}
                  >
                    {item.name}
                  </Text>
                  <Text style={styles.itemMeta}>
                    {item.kcal} kcal • {item.pro}g Protein
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ))}
        <View style={{ height: 80 }} />
      </ScrollView>

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Add Food to{" "}
              {activePeriodIndex !== null && dietPlan[activePeriodIndex].period}
            </Text>

            <TextInput
              style={styles.modalInput}
              placeholder="Food Name"
              placeholderTextColor="#666"
              value={newName}
              onChangeText={setNewName}
            />
            <View style={styles.row}>
              <TextInput
                style={[styles.modalInput, { width: "48%" }]}
                placeholder="Kcal"
                placeholderTextColor="#666"
                keyboardType="numeric"
                value={newKcal}
                onChangeText={setNewKcal}
              />
              <TextInput
                style={[styles.modalInput, { width: "48%" }]}
                placeholder="Protein (g)"
                placeholderTextColor="#666"
                keyboardType="numeric"
                value={newPro}
                onChangeText={setNewPro}
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => {
                  setModalVisible(false);
                  setNewName("");
                  setNewKcal("");
                  setNewPro("");
                }}
              >
                <Text style={{ color: "white", fontWeight: "bold" }}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.saveBtn} onPress={addCustomFood}>
                <Text style={{ color: "white", fontWeight: "bold" }}>
                  Add Item
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", paddingHorizontal: 20 },
  loader: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  statContainer: { marginVertical: 20 },
  statBox: { marginBottom: 15 },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  statLabel: { color: "#8E8E93", fontSize: 14, fontWeight: "600" },
  statValue: { color: "white", fontSize: 14, fontWeight: "bold" },
  barBg: {
    height: 10,
    backgroundColor: "#1C1C1E",
    borderRadius: 5,
    overflow: "hidden",
  },
  barFill: { height: "100%", borderRadius: 5 },
  sectionWrapper: {
    backgroundColor: "#1C1C1E",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#2C2C2E",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#333",
    paddingBottom: 10,
  },
  sectionTitle: { color: "#007AFF", fontSize: 17, fontWeight: "bold" },
  sectionTime: { color: "#666", fontSize: 12, marginTop: 2 },
  itemRow: { flexDirection: "row", alignItems: "center", marginVertical: 10 },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 7,
    borderColor: "#444",
    borderWidth: 2,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  checked: { backgroundColor: "#34C759", borderColor: "#34C759" },
  itemName: { color: "white", fontSize: 15, fontWeight: "500" },
  itemMeta: { color: "#555", fontSize: 11, marginTop: 2 },
  strikethrough: { color: "#666", textDecorationLine: "line-through" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#1C1C1E",
    padding: 25,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#333",
  },
  modalTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  modalInput: {
    backgroundColor: "#2C2C2E",
    color: "white",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
  },
  row: { flexDirection: "row", justifyContent: "space-between" },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  cancelBtn: {
    backgroundColor: "#444",
    padding: 15,
    borderRadius: 12,
    width: "45%",
    alignItems: "center",
  },
  saveBtn: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 12,
    width: "45%",
    alignItems: "center",
  },
});
