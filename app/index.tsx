import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import AddTaskScreen from "../components/myscreens/AddTaskScreen"; // Make sure path is correct
import FoodScreen from "../components/myscreens/FoodScreen";
import HomeScreen from "../components/myscreens/HomeScreen";
import WeightScreen from "../components/myscreens/WeightScreen";
import WorkScreen from "../components/myscreens/WorkScreen";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState("Home");
  const [userWeight, setUserWeight] = useState("54");

  useEffect(() => {
    const loadInitialWeight = async () => {
      try {
        const saved = await AsyncStorage.getItem("@weight_history");
        if (saved !== null) {
          const parsed = JSON.parse(saved);
          if (parsed.length > 0) {
            // Calculate cumulative weight for header
            const gained = parsed.reduce(
              (sum: number, item: { amount: string }) =>
                sum + parseFloat(item.amount),
              0,
            );
            setUserWeight((54 + gained).toFixed(2));
          }
        }
      } catch (e) {
        console.log("Error loading weight");
      }
    };
    loadInitialWeight();
  }, []);

  const renderScreen = () => {
    switch (currentScreen) {
      case "Home":
        return <HomeScreen />;
      case "Food":
        return <FoodScreen />;
      case "Work":
        return <WorkScreen />;
      case "AddTask":
        return <AddTaskScreen onGoBack={() => setCurrentScreen("Home")} />;
      case "Weight":
        return (
          <WeightScreen
            onWeightUpdate={(newW: React.SetStateAction<string>) =>
              setUserWeight(newW)
            }
          />
        );
      default:
        return (
          <View style={styles.center}>
            <Text>{currentScreen} Coming Soon</Text>
          </View>
        );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* GLOBAL APP HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Bulking_App</Text>
          <Text style={styles.headerSubtitle}>Target: 63kg • July 2nd</Text>
        </View>
        <View style={styles.profileCircle}>
          <Text style={styles.profileText}>{userWeight}</Text>
        </View>
      </View>

      <View style={{ flex: 1 }}>{renderScreen()}</View>

      {/* BOTTOM NAVIGATION BAR */}
      <View style={styles.navBar}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setCurrentScreen("Home")}
        >
          <Feather
            name="home"
            size={22}
            color={currentScreen === "Home" ? "#007AFF" : "#666"}
          />
          <Text
            style={[
              styles.navLabel,
              currentScreen === "Home" && { color: "#007AFF" },
            ]}
          >
            Home
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setCurrentScreen("Food")}
        >
          <Feather
            name="book-open"
            size={22}
            color={currentScreen === "Food" ? "#007AFF" : "#666"}
          />
          <Text
            style={[
              styles.navLabel,
              currentScreen === "Food" && { color: "#007AFF" },
            ]}
          >
            Food
          </Text>
        </TouchableOpacity>

        {/* Action Button Fixed: Now switches to AddTask screen */}
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => setCurrentScreen("AddTask")}
          activeOpacity={0.7}
        >
          <Feather name="plus" size={28} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setCurrentScreen("Weight")}
        >
          <Feather
            name="trending-up"
            size={22}
            color={currentScreen === "Weight" ? "#007AFF" : "#666"}
          />
          <Text
            style={[
              styles.navLabel,
              currentScreen === "Weight" && { color: "#007AFF" },
            ]}
          >
            Weight
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setCurrentScreen("Work")}
        >
          <Feather
            name="award"
            size={22}
            color={currentScreen === "Work" ? "#007AFF" : "#666"}
          />
          <Text
            style={[
              styles.navLabel,
              currentScreen === "Work" && { color: "#007AFF" },
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
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "android" ? 45 : 10,
    paddingBottom: 20,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  headerSubtitle: {
    color: "#666",
    fontSize: 12,
  },
  profileCircle: {
    backgroundColor: "#1C1C1E",
    // Remove fixed width if it's there
    minWidth: 45, // Minimum size for a single digit
    height: 45,
    borderRadius: 22.5,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 8, // Adds space so the text doesn't touch the edges
    borderWidth: 1,
    borderColor: "#333",
  },
  profileText: {
    color: "white",
    fontSize: 14, // Slightly smaller to fit "54.00"
    fontWeight: "bold",
  },
  navBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#111",
    paddingVertical: 15,
    borderTopWidth: 0.5,
    borderTopColor: "#333",
  },
  navItem: {
    alignItems: "center",
  },
  navLabel: {
    fontSize: 10,
    color: "#666",
    marginTop: 4,
  },
  addBtn: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    marginTop: -40,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
