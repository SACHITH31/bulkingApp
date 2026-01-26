import { Feather } from "@expo/vector-icons";
import React from "react";
import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function WorkScreen() {
  // Get current day (0 = Sunday, 1 = Monday, etc.)
  const dayIndex = new Date().getDay();
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const today = days[dayIndex];

  // Workout Data
  const workoutPlan: any = {
    Monday: {
      title: "Push Day (Chest/Shoulders/Triceps)",
      exercises: [
        {
          name: "Band Chest Press",
          reps: "3 sets x 12-15",
          link: "https://youtu.be/example1",
        },
        {
          name: "Band Overhead Press",
          reps: "3 sets x 10-12",
          link: "https://youtu.be/example2",
        },
        {
          name: "Band Tricep Extensions",
          reps: "3 sets x 15",
          link: "https://youtu.be/example3",
        },
      ],
    },
    Tuesday: {
      title: "Pull Day (Back/Biceps)",
      exercises: [
        {
          name: "Band Seated Row",
          reps: "3 sets x 12-15",
          link: "https://youtu.be/example4",
        },
        {
          name: "Band Lat Pulldowns",
          reps: "3 sets x 10-12",
          link: "https://youtu.be/example5",
        },
        {
          name: "Band Bicep Curls",
          reps: "3 sets x 15",
          link: "https://youtu.be/example6",
        },
      ],
    },
    Wednesday: { title: "Rest Day", exercises: [] },
    Thursday: {
      title: "Legs & Abs",
      exercises: [
        {
          name: "Band Squats",
          reps: "3 sets x 15-20",
          link: "https://youtu.be/example7",
        },
        {
          name: "Band Deadlifts",
          reps: "3 sets x 12",
          link: "https://youtu.be/example8",
        },
        {
          name: "Resistance Band Crunches",
          reps: "3 sets x 20",
          link: "https://youtu.be/example9",
        },
      ],
    },
    Friday: {
      title: "Upper Body Focus",
      exercises: [
        {
          name: "Band Push-ups",
          reps: "3 sets x Max",
          link: "https://youtu.be/example10",
        },
        {
          name: "Band Face Pulls",
          reps: "3 sets x 15",
          link: "https://youtu.be/example11",
        },
      ],
    },
    Saturday: {
      title: "Full Body / Weak Points",
      exercises: [
        {
          name: "Mixed Band Circuit",
          reps: "4 rounds",
          link: "https://youtu.be/example12",
        },
      ],
    },
    Sunday: { title: "Rest Day", exercises: [] },
  };

  const currentWorkout = workoutPlan[today];

  return (
    <View style={styles.container}>
      <View style={styles.headerBox}>
        <Text style={styles.dayText}>Today is {today}</Text>
        <Text style={styles.titleText}>{currentWorkout.title}</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {currentWorkout.exercises.length > 0 ? (
          currentWorkout.exercises.map((ex: any, index: number) => (
            <View key={index} style={styles.exCard}>
              <View style={{ flex: 1 }}>
                <Text style={styles.exName}>{ex.name}</Text>
                <Text style={styles.exReps}>{ex.reps}</Text>
              </View>
              <TouchableOpacity
                style={styles.ytBtn}
                onPress={() => Linking.openURL(ex.link)}
              >
                <Feather name="play-circle" size={24} color="#FF0000" />
                <Text style={styles.ytText}>Watch</Text>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <View style={styles.restCard}>
            <Feather name="coffee" size={40} color="#666" />
            <Text style={styles.restText}>
              It's a Rest Day! Recovery is key for muscle gain.
            </Text>
          </View>
        )}

        <View style={styles.proTip}>
          <Text style={styles.proTipTitle}>Pro Tip: Progressive Overload</Text>
          <Text style={styles.proTipText}>
            If {today}'s workout felt easy, increase the band tension or add 2
            more reps per set.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", paddingHorizontal: 20 },
  headerBox: { marginVertical: 20 },
  dayText: {
    color: "#007AFF",
    fontWeight: "bold",
    fontSize: 14,
    textTransform: "uppercase",
  },
  titleText: { color: "white", fontSize: 24, fontWeight: "bold", marginTop: 5 },
  exCard: {
    flexDirection: "row",
    backgroundColor: "#1C1C1E",
    padding: 20,
    borderRadius: 15,
    marginBottom: 12,
    alignItems: "center",
  },
  exName: { color: "white", fontSize: 16, fontWeight: "bold" },
  exReps: { color: "#666", fontSize: 13, marginTop: 4 },
  ytBtn: { alignItems: "center", marginLeft: 10 },
  ytText: { color: "#FF0000", fontSize: 10, marginTop: 2, fontWeight: "bold" },
  restCard: { alignItems: "center", marginTop: 50 },
  restText: { color: "#666", textAlign: "center", marginTop: 15, fontSize: 16 },
  proTip: {
    backgroundColor: "#1C1C1E",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    borderLeftWidth: 3,
    borderLeftColor: "#34C759",
  },
  proTipTitle: { color: "#34C759", fontWeight: "bold", fontSize: 12 },
  proTipText: { color: "#aaa", fontSize: 12, marginTop: 4 },
});
