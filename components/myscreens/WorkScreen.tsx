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
  // Logic to get the current day
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

  // Data Source: 5-Day Resistance Band Workout Plan
  const workoutPlan: any = {
    Monday: {
      title: "Full Body Strength",
      exercises: [
        {
          name: "Band Squat",
          reps: "3 x 12",
          link: "https://www.youtube.com/watch?v=NtgpX9twRmg",
        },
        {
          name: "Band Chest Press",
          reps: "3 x 12",
          link: "https://www.youtube.com/watch?v=NtgpX9twRmg",
        },
        {
          name: "Seated Band Row",
          reps: "3 x 12",
          link: "https://www.youtube.com/watch?v=Lk5PisETE9I",
        },
        {
          name: "Band Biceps Curl",
          reps: "3 x 12",
          link: "https://www.youtube.com/watch?v=Lk5PisETE9I",
        },
      ],
    },
    Tuesday: {
      title: "Upper Body",
      exercises: [
        {
          name: "Band Shoulder Press",
          reps: "3 x 12",
          link: "https://www.youtube.com/watch?v=NtgpX9twRmg",
        },
        {
          name: "Band Triceps Extension",
          reps: "3 x 12",
          link: "https://www.youtube.com/watch?v=Lk5PisETE9I",
        },
        {
          name: "Push-Ups",
          reps: "3 x 10",
          link: "https://www.youtube.com/watch?v=IODxDxX7oi4",
        },
        {
          name: "Plank",
          reps: "3 x 30 sec",
          link: "https://www.youtube.com/watch?v=pSHjTRCQxIw",
        },
      ],
    },
    Wednesday: {
      title: "Lower Body",
      exercises: [
        {
          name: "Band Deadlift",
          reps: "3 x 12",
          link: "https://www.youtube.com/watch?v=NtgpX9twRmg",
        },
        {
          name: "Glute Bridge",
          reps: "3 x 15",
          link: "https://www.youtube.com/watch?v=m2Zx-57cSok",
        },
        {
          name: "Band Lunges",
          reps: "3 x 10",
          link: "https://www.youtube.com/watch?v=QOVaHwm-Q6U",
        },
        {
          name: "Calf Raises",
          reps: "3 x 15",
          link: "https://www.youtube.com/watch?v=-M4-G8p8fmc",
        },
      ],
    },
    Thursday: {
      title: "REST DAY",
      exercises: [],
      message: "Light walking + stretching only",
    },
    Friday: {
      title: "Full Body",
      exercises: [
        {
          name: "Band Squat",
          reps: "4 x 12",
          link: "https://www.youtube.com/watch?v=NtgpX9twRmg",
        },
        {
          name: "Bent Over Row",
          reps: "4 x 12",
          link: "https://www.youtube.com/watch?v=Lk5PisETE9I",
        },
        {
          name: "Band Shoulder Press",
          reps: "3 x 12",
          link: "https://www.youtube.com/watch?v=NtgpX9twRmg",
        },
        {
          name: "Crunches",
          reps: "3 x 15",
          link: "https://www.youtube.com/watch?v=Xyd_fa5zoEU",
        },
      ],
    },
    Saturday: {
      title: "Light Cardio + Core",
      exercises: [
        {
          name: "Jumping Jacks",
          reps: "3 x 30 sec",
          link: "https://www.youtube.com/watch?v=c4DAnQ6DtF8",
        },
        {
          name: "Mountain Climbers",
          reps: "3 x 30 sec",
          link: "https://www.youtube.com/watch?v=nmwgirgXLYM",
        },
        {
          name: "Russian Twists",
          reps: "3 x 15",
          link: "https://www.youtube.com/watch?v=wkD8rjkodUI",
        },
        {
          name: "Leg Raises",
          reps: "3 x 12",
          link: "https://www.youtube.com/watch?v=JB2oyawG9KI",
        },
      ],
    },
    Sunday: {
      title: "REST DAY",
      exercises: [],
      message: "Complete Rest + Good Nutrition",
    },
  };

  const currentWorkout = workoutPlan[today];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.dayLabel}>{today.toUpperCase()}</Text>
        <Text style={styles.title}>{currentWorkout.title}</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {currentWorkout.exercises.length > 0 ? (
          currentWorkout.exercises.map((ex: any, i: number) => (
            <TouchableOpacity
              key={i}
              style={styles.exCard}
              onPress={() => Linking.openURL(ex.link)}
            >
              <View style={styles.exInfo}>
                <Text style={styles.exName}>{ex.name}</Text>
                <Text style={styles.exReps}>{ex.reps}</Text>
              </View>
              <View style={styles.playIcon}>
                <Feather name="play" size={16} color="white" />
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.restContainer}>
            <Feather name="coffee" size={48} color="#444" />
            <Text style={styles.restText}>{currentWorkout.message}</Text>
          </View>
        )}

        <View style={styles.progressionBox}>
          <Text style={styles.progTitle}>PROGRESSION RULE</Text>
          <Text style={styles.progText}>
            Increase reps or use a stronger band every week to keep gaining
            muscle.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", padding: 20 },
  header: { marginBottom: 25 },
  dayLabel: {
    color: "#007AFF",
    fontSize: 12,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  title: { color: "white", fontSize: 28, fontWeight: "bold", marginTop: 4 },
  exCard: {
    flexDirection: "row",
    backgroundColor: "#1C1C1E",
    padding: 20,
    borderRadius: 15,
    marginBottom: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#333",
  },
  exInfo: { flex: 1 },
  exName: { color: "white", fontSize: 16, fontWeight: "bold" },
  exReps: { color: "#8E8E93", fontSize: 14, marginTop: 4 },
  playIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FF3B30",
    justifyContent: "center",
    alignItems: "center",
  },
  restContainer: { alignItems: "center", marginTop: 60 },
  restText: {
    color: "#8E8E93",
    fontSize: 16,
    marginTop: 15,
    textAlign: "center",
  },
  progressionBox: {
    backgroundColor: "#1C1C1E",
    padding: 15,
    borderRadius: 12,
    marginTop: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#34C759",
  },
  progTitle: { color: "#34C759", fontSize: 10, fontWeight: "bold" },
  progText: { color: "#D1D1D6", fontSize: 12, marginTop: 5 },
});
