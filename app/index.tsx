import { Feather } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AddTaskScreen from "../components/myscreens/AddTaskScreen";
import FoodScreen from "../components/myscreens/FoodScreen";
import HomeScreen from "../components/myscreens/HomeScreen";
import LoadingScreen from "../components/myscreens/LoadingScreen"; // Ensure this path is correct
import WeightScreen from "../components/myscreens/WeightScreen";
import WorkScreen from "../components/myscreens/WorkScreen";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentScreen, setCurrentScreen] = useState("Home");
  const [userWeight, setUserWeight] = useState("54.00");
  const [editingTask, setEditingTask] = useState(null);

  // Starter Loading Animation Effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000); // Shows splash for 2.5 seconds
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case "Home":
        return (
          <HomeScreen
            onEditTask={(task: any) => {
              setEditingTask(task);
              setCurrentScreen("AddTask");
            }}
          />
        );
      case "Food":
        return <FoodScreen />;
      case "Work":
        return <WorkScreen />;
      case "AddTask":
        return (
          <AddTaskScreen
            editTask={editingTask}
            onGoBack={() => {
              setEditingTask(null);
              setCurrentScreen("Home");
            }}
          />
        );
      case "Weight":
        return (
          <WeightScreen
            onWeightUpdate={(newW: string) => setUserWeight(newW)}
          />
        );
      default:
        return (
          <View style={styles.center}>
            <Text style={{ color: "white" }}>{currentScreen} Coming Soon</Text>
          </View>
        );
    }
  };

  return (
    <View style={styles.container}>
      {/* HEADER LOGIC: 
         Hide the global header when AddTask is active to match your screenshot 
      */}
      {currentScreen !== "AddTask" && (
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Bulking_App</Text>
            <Text style={styles.headerSub}>Target: 63kg • July 2nd</Text>
          </View>
          <View style={styles.weightBadge}>
            <Text style={styles.weightText}>{userWeight}</Text>
          </View>
        </View>
      )}

      <View style={{ flex: 1 }}>{renderScreen()}</View>

      {/* NAVIGATION BAR LOGIC: 
         Hide when adding/editing a task for a clean workspace 
      */}
      {currentScreen !== "AddTask" && (
        <View style={styles.navBar}>
          <TouchableOpacity onPress={() => setCurrentScreen("Home")}>
            <Feather
              name="home"
              size={24}
              color={currentScreen === "Home" ? "#007AFF" : "#666"}
            />
            <Text
              style={[
                styles.navText,
                currentScreen === "Home" && styles.activeNavText,
              ]}
            >
              Home
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setCurrentScreen("Food")}>
            <Feather
              name="book-open"
              size={24}
              color={currentScreen === "Food" ? "#007AFF" : "#666"}
            />
            <Text
              style={[
                styles.navText,
                currentScreen === "Food" && styles.activeNavText,
              ]}
            >
              Food
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.floatingAdd}
            onPress={() => {
              setEditingTask(null);
              setCurrentScreen("AddTask");
            }}
          >
            <Feather name="plus" size={30} color="white" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setCurrentScreen("Weight")}>
            <Feather
              name="trending-up"
              size={24}
              color={currentScreen === "Weight" ? "#007AFF" : "#666"}
            />
            <Text
              style={[
                styles.navText,
                currentScreen === "Weight" && styles.activeNavText,
              ]}
            >
              Weight
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setCurrentScreen("Work")}>
            <Feather
              name="bookmark"
              size={24}
              color={currentScreen === "Work" ? "#007AFF" : "#666"}
            />
            <Text
              style={[
                styles.navText,
                currentScreen === "Work" && styles.activeNavText,
              ]}
            >
              Work
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  headerTitle: { color: "white", fontSize: 28, fontWeight: "bold" },
  headerSub: { color: "#666", fontSize: 14 },
  weightBadge: {
    backgroundColor: "#1C1C1E",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  weightText: { color: "white", fontWeight: "bold", fontSize: 18 },
  navBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#000",
    paddingVertical: 15,
    borderTopWidth: 0.5,
    borderTopColor: "#333",
    alignItems: "center",
  },
  navText: { color: "#666", fontSize: 10, textAlign: "center", marginTop: 4 },
  activeNavText: { color: "#007AFF" },
  floatingAdd: {
    backgroundColor: "#007AFF",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -40,
    elevation: 5,
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
