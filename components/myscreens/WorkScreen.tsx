import { Feather } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Vibration,
  View,
} from "react-native";
import { getDayName, getWorkoutForDate } from "../../utils/workoutPlan";

export default function WorkScreen() {
  // --- NEW TIMER LOGIC ---
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [restSeconds, setRestSeconds] = useState(0);
  const [isResting, setIsResting] = useState(false);

  const workoutInterval = useRef<NodeJS.Timeout | null>(null);
  const restInterval = useRef<NodeJS.Timeout | null>(null);

  // Total Workout Stopwatch
  useEffect(() => {
    if (isActive) {
      workoutInterval.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (workoutInterval.current) clearInterval(workoutInterval.current);
    }
    return () => {
      if (workoutInterval.current) clearInterval(workoutInterval.current);
    };
  }, [isActive]);

  // Rest Timer
  useEffect(() => {
    if (isResting && restSeconds > 0) {
      restInterval.current = setInterval(() => {
        setRestSeconds((prev) => prev - 1);
      }, 1000);
    } else if (restSeconds === 0 && isResting) {
      Vibration.vibrate([0, 500, 200, 500]);
      Alert.alert("Rest Over!", "Time for the next set! 💪");
      setIsResting(false);
      if (restInterval.current) clearInterval(restInterval.current);
    }
    return () => {
      if (restInterval.current) clearInterval(restInterval.current);
    };
  }, [isResting, restSeconds]);

  const formatTime = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };
  // --- END OF NEW LOGIC ---

  const todayDate = new Date();
  const today = getDayName(todayDate);
  const currentWorkout =
    getWorkoutForDate(todayDate) || {
      title: "Workout",
      exercises: [],
      message: "Get moving!",
    };

  return (
    <View style={styles.container}>
      {/* 1. HEADER SECTION (UNTOUCHED) */}
      <View style={styles.header}>
        <Text style={styles.dayLabel}>{today.toUpperCase()}</Text>
        <Text style={styles.title}>{currentWorkout.title}</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 2. NEW STOPWATCH UI (INJECTED) */}
        <View style={styles.timerCard}>
          <Text style={styles.timerSub}>WORKOUT DURATION</Text>
          <Text style={styles.timerText}>{formatTime(seconds)}</Text>
          <View style={styles.timerActions}>
            <TouchableOpacity
              style={[
                styles.playBtn,
                isActive && { backgroundColor: "#FF9500" },
              ]}
              onPress={() => setIsActive(!isActive)}
            >
              <Feather
                name={isActive ? "pause" : "play"}
                size={20}
                color="white"
              />
              <Text style={styles.btnText}>{isActive ? "PAUSE" : "START"}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.refreshBtn}
              onPress={() => {
                setSeconds(0);
                setIsActive(false);
              }}
            >
              <Feather name="refresh-cw" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* 3. NEW REST TIMER UI (INJECTED) */}
        <View style={styles.restCard}>
          <View style={styles.restHeader}>
            <Text style={styles.restTitle}>REST TIMER</Text>
            <Text style={styles.restCountdown}>{restSeconds}s</Text>
          </View>
          <View style={styles.restOptions}>
            {[30, 45, 60, 90].map((t) => (
              <TouchableOpacity
                key={t}
                style={styles.timeTag}
                onPress={() => {
                  setRestSeconds(t);
                  setIsResting(true);
                }}
              >
                <Text style={styles.timeTagText}>+{t}s</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 4. EXERCISES LIST (UNTOUCHED) */}
        <Text style={styles.sectionLabel}>TODAY'S EXERCISES</Text>
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

        {/* 5. PROGRESSION BOX (UNTOUCHED) */}
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
  header: { marginBottom: 20 },
  dayLabel: {
    color: "#007AFF",
    fontSize: 12,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  title: { color: "white", fontSize: 28, fontWeight: "bold", marginTop: 4 },

  // NEW STYLES
  timerCard: {
    backgroundColor: "#1C1C1E",
    padding: 20,
    borderRadius: 20,
    marginBottom: 15,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#333",
  },
  timerSub: {
    color: "#8E8E93",
    fontSize: 10,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  timerText: {
    color: "white",
    fontSize: 48,
    fontWeight: "bold",
    marginVertical: 10,
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
  },
  timerActions: { flexDirection: "row", gap: 15, alignItems: "center" },
  playBtn: {
    backgroundColor: "#34C759",
    flexDirection: "row",
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 25,
    gap: 8,
    alignItems: "center",
  },
  refreshBtn: { backgroundColor: "#333", padding: 12, borderRadius: 50 },
  btnText: { color: "white", fontWeight: "bold", fontSize: 14 },

  restCard: {
    backgroundColor: "#1C1C1E",
    padding: 20,
    borderRadius: 20,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: "#333",
  },
  restHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  restTitle: { color: "#8E8E93", fontSize: 12, fontWeight: "bold" },
  restCountdown: { color: "#007AFF", fontSize: 24, fontWeight: "bold" },
  restOptions: { flexDirection: "row", justifyContent: "space-between" },
  timeTag: {
    backgroundColor: "#333",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  timeTagText: { color: "white", fontWeight: "bold", fontSize: 12 },
  sectionLabel: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },

  // EXISTING STYLES
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
  restContainer: { alignItems: "center", marginTop: 40, marginBottom: 40 },
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
    marginTop: 10,
    marginBottom: 30,
    borderLeftWidth: 4,
    borderLeftColor: "#34C759",
  },
  progTitle: { color: "#34C759", fontSize: 10, fontWeight: "bold" },
  progText: { color: "#D1D1D6", fontSize: 12, marginTop: 5 },
});
