import { Feather } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function FoodScreen() {
  // 1. STATE MANAGEMENT: Organizing items by "Period"
  const [dietPlan, setDietPlan] = useState([
    {
      period: "After Bed",
      completed: false,
      items: [{ id: 1, name: "1 Glass Water", kcal: 0, pro: 0, done: false }],
    },
    {
      period: "Breakfast",
      completed: false,
      items: [
        { id: 2, name: "Milk (250ml)", kcal: 150, pro: 8, done: false },
        { id: 3, name: "1 Banana", kcal: 100, pro: 1, done: false },
        { id: 4, name: "10 Almonds", kcal: 70, pro: 2, done: false },
        { id: 5, name: "40g Oats", kcal: 150, pro: 5, done: false },
      ],
    },
    {
      period: "College Snack",
      completed: false,
      items: [
        { id: 6, name: "1 Fruit", kcal: 80, pro: 1, done: false },
        { id: 7, name: "20g Peanuts", kcal: 115, pro: 5, done: false },
      ],
    },
    {
      period: "Lunch",
      completed: false,
      items: [
        { id: 8, name: "Rice (Large Portion)", kcal: 350, pro: 6, done: false },
        { id: 9, name: "Channa Dal", kcal: 180, pro: 12, done: false },
        { id: 10, name: "1 tsp Ghee", kcal: 90, pro: 0, done: false },
        { id: 11, name: "Salad", kcal: 40, pro: 1, done: false },
      ],
    },
    {
      period: "Evening Snack",
      completed: false,
      items: [
        { id: 12, name: "1 Banana", kcal: 100, pro: 1, done: false },
        { id: 13, name: "30g Roasted Chana", kcal: 110, pro: 6, done: false },
      ],
    },
    {
      period: "Evening Shake",
      completed: false,
      items: [
        {
          id: 14,
          name: "Milk, Banana, Oats, PB",
          kcal: 400,
          pro: 25,
          done: false,
        },
      ],
    },
    {
      period: "Dinner",
      completed: false,
      items: [
        { id: 15, name: "Rice", kcal: 300, pro: 5, done: false },
        { id: 16, name: "Dal", kcal: 180, pro: 12, done: false },
        { id: 17, name: "Milk", kcal: 150, pro: 8, done: false },
      ],
    },
    {
      period: "Before Bed",
      completed: false,
      items: [{ id: 18, name: "1 Glass Milk", kcal: 130, pro: 6, done: false }],
    },
  ]);

  // 2. MIDNIGHT RESET LOGIC
  useEffect(() => {
    const now = new Date();
    const night = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
      0,
      0,
      0,
    );
    const msToMidnight = night.getTime() - now.getTime();

    const timer = setTimeout(() => {
      // Reset all items to "false"
      setDietPlan((prev) =>
        prev.map((section) => ({
          ...section,
          completed: false,
          items: section.items.map((item) => ({ ...item, done: false })),
        })),
      );
    }, msToMidnight);

    return () => clearTimeout(timer);
  }, []);

  // 3. TOGGLE FUNCTION
  const toggleItem = (periodIndex: number, itemId: number) => {
    const updatedPlan = [...dietPlan];
    const section = updatedPlan[periodIndex];
    const item = section.items.find((i) => i.id === itemId);

    if (item) {
      item.done = !item.done;
      // Auto-check section if all items are done
      section.completed = section.items.every((i) => i.done);
      setDietPlan(updatedPlan);
    }
  };

  // 4. CALCULATION
  const allItems = dietPlan.flatMap((p) => p.items);
  const currentKcal = allItems.reduce(
    (sum, i) => (i.done ? sum + i.kcal : sum),
    0,
  );
  const currentPro = allItems.reduce(
    (sum, i) => (i.done ? sum + i.pro : sum),
    0,
  );

  return (
    <View style={styles.container}>
      {/* 5. TOP PROGRESS BARS (STACKED) */}
      <View style={styles.statContainer}>
        <View style={styles.statBox}>
          <View style={styles.labelRow}>
            <Text style={styles.statLabel}>Calories</Text>
            <Text style={styles.statValue}>{currentKcal}/2600</Text>
          </View>
          <View style={styles.barBg}>
            <View
              style={[
                styles.barFill,
                {
                  width: `${(currentKcal / 2600) * 100}%`,
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
                  width: `${(currentPro / 95) * 100}%`,
                  backgroundColor: "#34C759",
                },
              ]}
            />
          </View>
        </View>
      </View>

      {/* 6. SECTIONED LIST */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {dietPlan.map((section, pIdx) => (
          <View key={pIdx} style={styles.sectionWrapper}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{section.period}</Text>
              {section.completed && (
                <Feather name="check-circle" size={18} color="#34C759" />
              )}
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
                <Text
                  style={[styles.itemName, item.done && styles.strikethrough]}
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", paddingHorizontal: 20 },
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
    height: 8,
    backgroundColor: "#1C1C1E",
    borderRadius: 4,
    overflow: "hidden",
  },
  barFill: { height: "100%", borderRadius: 4 },
  sectionWrapper: {
    backgroundColor: "#1C1C1E",
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#333",
    paddingBottom: 8,
  },
  sectionTitle: { color: "#007AFF", fontSize: 16, fontWeight: "bold" },
  itemRow: { flexDirection: "row", alignItems: "center", marginVertical: 8 },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderSize: 2,
    borderColor: "#444",
    borderWidth: 2,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  checked: { backgroundColor: "#34C759", borderColor: "#34C759" },
  itemName: { color: "white", fontSize: 15 },
  strikethrough: { color: "#666", textDecorationLine: "line-through" },
});
