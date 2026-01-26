import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function WorkScreen() {
  // 5-Day Split based on your PDF
  const [workouts, setWorkouts] = useState([
    {
      id: 1,
      day: "Day 1",
      muscle: "Push (Chest/Shoulders/Triceps)",
      done: false,
    },
    { id: 2, day: "Day 2", muscle: "Pull (Back/Biceps)", done: false },
    { id: 3, day: "Day 3", muscle: "Legs/Abs", done: false },
    { id: 4, day: "Day 4", muscle: "Upper Body Focus", done: false },
    { id: 5, day: "Day 5", muscle: "Full Body / Weak Points", done: false },
  ]);

  const toggleWorkout = (id: number) => {
    setWorkouts(
      workouts.map((w) => (w.id === id ? { ...w, done: !w.done } : w)),
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Workout Principles</Text>
        <Text style={styles.infoText}>• Frequency: 5 Days Per Week</Text>
        <Text style={styles.infoText}>
          • Progress: Increase reps every session
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Home Routine Checklist</Text>
        {workouts.map((workout) => (
          <TouchableOpacity
            key={workout.id}
            style={[styles.workBox, workout.done && styles.workBoxDone]}
            onPress={() => toggleWorkout(workout.id)}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.dayText}>{workout.day}</Text>
              <Text style={styles.muscleText}>{workout.muscle}</Text>
            </View>
            <Feather
              name={workout.done ? "check-circle" : "circle"}
              size={24}
              color={workout.done ? "#34C759" : "#333"}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", paddingHorizontal: 20 },
  infoCard: {
    backgroundColor: "#1C1C1E",
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#007AFF",
  },
  infoTitle: { color: "#007AFF", fontWeight: "bold", marginBottom: 8 },
  infoText: { color: "#aaa", fontSize: 13, lineHeight: 20 },
  sectionTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  workBox: {
    flexDirection: "row",
    backgroundColor: "#1C1C1E",
    padding: 20,
    borderRadius: 15,
    marginBottom: 12,
    alignItems: "center",
  },
  workBoxDone: { opacity: 0.6 },
  dayText: {
    color: "#666",
    fontSize: 12,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  muscleText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 4,
  },
});
