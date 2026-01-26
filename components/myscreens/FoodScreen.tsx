import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function FoodScreen() {
  const [loading, setLoading] = useState(true);
  const [dietPlan, setDietPlan] = useState([
    {
      period: "After Bed",
      time: "5:00 AM",
      completed: false,
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
      completed: false,
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
      completed: false,
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
      completed: false,
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
      completed: false,
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
      completed: false,
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
      completed: false,
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
      completed: false,
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

      // Check if it's a new day
      if (savedDate !== todayDate) {
        // It's a new day! Keep default plan (all unchecked)
        await AsyncStorage.setItem("@last_food_date", todayDate);
        // Clear old progress
        await AsyncStorage.removeItem("@diet_plan_state");
      } else if (savedPlan) {
        // Same day, load previous selections
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
    } catch (e) {
      console.log("Error saving food data");
    }
  };

  const toggleItem = (periodIndex: number, itemId: number) => {
    const updatedPlan = [...dietPlan];
    const section = updatedPlan[periodIndex];
    const item = section.items.find((i) => i.id === itemId);

    if (item) {
      item.done = !item.done;
      section.completed = section.items
        .filter((i) => !i.optional)
        .every((i) => i.done);

      setDietPlan(updatedPlan);
      saveData(updatedPlan); // Save to storage immediately
    }
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

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

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
              {section.completed && (
                <View style={styles.doneBadge}>
                  <Feather name="check-circle" size={16} color="#34C759" />
                  <Text style={styles.doneText}>Done</Text>
                </View>
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
        <View style={{ height: 60 }} />
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
  doneBadge: { flexDirection: "row", alignItems: "center" },
  doneText: {
    color: "#34C759",
    fontSize: 12,
    marginLeft: 5,
    fontWeight: "bold",
  },
});
