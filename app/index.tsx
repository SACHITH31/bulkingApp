import { Feather } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AddTaskScreen from "../components/myscreens/AddTaskScreen";
import FoodScreen from "../components/myscreens/FoodScreen";
import HomeScreen from "../components/myscreens/HomeScreen";
import LoadingScreen from "../components/myscreens/LoadingScreen";
import WeightScreen from "../components/myscreens/WeightScreen";
import WorkScreen from "../components/myscreens/WorkScreen";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentScreen, setCurrentScreen] = useState("Home");
  const [userWeight, setUserWeight] = useState("54.00");
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000); // 5 second animation as requested
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
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* GLOBAL HEADER - Always Visible */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View>
            <Text style={styles.headerTitle}>MassFlow</Text>
            <Text style={styles.headerSub}>Target: 63kg • July 2nd</Text>
          </View>
        </View>

        <View style={styles.weightBadge}>
          <Text style={styles.weightText}>{userWeight}</Text>
        </View>
      </View>

      {/* MAIN CONTENT AREA */}
      <View style={{ flex: 1 }}>{renderScreen()}</View>

      {/* GLOBAL NAVIGATION BAR - Always Visible */}
      <View style={styles.navBar}>
        <TouchableOpacity
          onPress={() => setCurrentScreen("Home")}
          style={styles.navItem}
        >
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

        <TouchableOpacity
          onPress={() => setCurrentScreen("Food")}
          style={styles.navItem}
        >
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

        <TouchableOpacity
          onPress={() => setCurrentScreen("Weight")}
          style={styles.navItem}
        >
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

        <TouchableOpacity
          onPress={() => setCurrentScreen("Work")}
          style={styles.navItem}
        >
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
    letterSpacing: -0.5,
    marginTop: 30,
  },
  headerSub: {
    color: "#666",
    fontSize: 14,
    marginTop: -1,
    marginBottom: 5,
  },
  weightBadge: {
    backgroundColor: "#1C1C1E",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 24,
  },
  weightText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  navBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#000",
    paddingVertical: 10,
    borderTopWidth: 0.5,
    borderTopColor: "#333",
    alignItems: "center",
    height: 90,
  },
  navItem: { alignItems: "center", justifyContent: "center" },
  navText: { color: "#666", fontSize: 10, textAlign: "center", marginTop: 4 },
  activeNavText: { color: "#007AFF" },
  floatingAdd: {
    backgroundColor: "#007AFF",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -50,
    elevation: 8,
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
