import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function FoodScreen() {
  // DATA SOURCE: Muscle Gain Diet Plan [cite: 12-34]
  const [meals, setMeals] = useState([
    {
      id: 1,
      name: "Morning (5:00 AM)",
      items: "1 Glass Water",
      kcal: 0,
      pro: 0,
      done: false,
    },
    {
      id: 2,
      name: "Breakfast (7:30 AM)",
      items: "Milk, Banana, 10 Almonds, 40g Oats",
      kcal: 440,
      pro: 14,
      done: false,
    },
    {
      id: 3,
      name: "College Snack (10:40 AM)",
      items: "1 Fruit, 20g Peanuts",
      kcal: 210,
      pro: 7,
      done: false,
    },
    {
      id: 4,
      name: "Lunch (1:00 PM)",
      items: "Rice, Channa Dal, Ghee, Salad",
      kcal: 660,
      pro: 21,
      done: false,
    },
    {
      id: 5,
      name: "Evening Snack (4:30 PM)",
      items: "1 Banana, 30g Roasted Chana",
      kcal: 210,
      pro: 7,
      done: false,
    },
    {
      id: 6,
      name: "Evening Shake (6:00 PM)",
      items: "Milk, Banana, Oats, Peanut Butter",
      kcal: 400,
      pro: 25,
      done: false,
    },
    {
      id: 7,
      name: "Dinner (7:30 PM)",
      items: "Rice, Dal, Milk",
      kcal: 660,
      pro: 26,
      done: false,
    },
    {
      id: 8,
      name: "Before Bed (9:30 PM)",
      items: "1 Glass Milk",
      kcal: 130,
      pro: 6,
      done: false,
    },
  ]);

  const toggleMeal = (id: number) => {
    setMeals(meals.map((m) => (m.id === id ? { ...m, done: !m.done } : m)));
  };

  // Calculations based on Targets [cite: 36, 37]
  const currentKcal = meals.reduce(
    (sum, m) => (m.done ? sum + m.kcal : sum),
    0,
  );
  const currentPro = meals.reduce((sum, m) => (m.done ? sum + m.pro : sum), 0);

  return (
    <View style={styles.container}>
      {/* Progress Cards based on Diet Plan Goals [cite: 7, 8] */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Calories</Text>
          <Text style={styles.statValue}>{currentKcal}/2600</Text>
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
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Protein</Text>
          <Text style={styles.statValue}>{currentPro}g/95g</Text>
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
        <Text style={styles.sectionTitle}>Diet Checklist</Text>
        {meals.map((meal) => (
          <TouchableOpacity
            key={meal.id}
            style={styles.mealItem}
            onPress={() => toggleMeal(meal.id)}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.mealName}>{meal.name}</Text>
              <Text style={styles.mealDesc}>{meal.items}</Text>
            </View>
            <View style={[styles.check, meal.done && styles.checked]}>
              {meal.done && <Feather name="check" size={14} color="white" />}
            </View>
          </TouchableOpacity>
        ))}
        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", paddingHorizontal: 20 },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
    marginTop: 10,
  },
  statCard: {
    backgroundColor: "#1C1C1E",
    width: "48%",
    padding: 15,
    borderRadius: 15,
  },
  statLabel: { color: "#666", fontSize: 12, fontWeight: "bold" },
  statValue: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 8,
  },
  barBg: { height: 4, backgroundColor: "#333", borderRadius: 2 },
  barFill: { height: "100%", borderRadius: 2 },
  sectionTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  mealItem: {
    flexDirection: "row",
    backgroundColor: "#1C1C1E",
    padding: 18,
    borderRadius: 15,
    marginBottom: 12,
    alignItems: "center",
  },
  mealName: { color: "white", fontWeight: "bold", fontSize: 14 },
  mealDesc: { color: "#666", fontSize: 11, marginTop: 4 },
  check: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#333",
  },
  checked: {
    backgroundColor: "#34C759",
    borderColor: "#34C759",
    justifyContent: "center",
    alignItems: "center",
  },
});
