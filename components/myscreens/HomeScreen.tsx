import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function HomeScreen() {
  const isFocused = useIsFocused(); // Refresh data when user returns to this screen
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [allTaskGroups, setAllTaskGroups] = useState([]);

  useEffect(() => {
    if (isFocused) {
      loadTasks();
    }
  }, [isFocused]);

  const loadTasks = async () => {
    try {
      const saved = await AsyncStorage.getItem("@task_groups");
      if (saved) setAllTaskGroups(JSON.parse(saved));
    } catch (e) {
      console.log("Error loading tasks");
    }
  };

  // Helper to normalize dates for comparison
  const getTaskCategory = (taskDateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const taskDate = new Date(taskDateStr);
    taskDate.setHours(0, 0, 0, 0);

    if (taskDate.getTime() === today.getTime()) return "Today";
    if (taskDate.getTime() < today.getTime()) return "Previous";
    return "Future";
  };

  const filteredTasks = allTaskGroups.filter((group) => {
    const category = getTaskCategory(group.date);

    // 1. Filter by Tab
    let matchesTab = false;
    if (activeTab === "All")
      matchesTab = category === "Today" || category === "Previous";
    else if (activeTab === "Previous") matchesTab = category === "Previous";
    else if (activeTab === "Today") matchesTab = category === "Today";
    else if (activeTab === "Future") matchesTab = category === "Future";
    else if (activeTab === "Completed") matchesTab = group.completed; // Logic for completion can be added later

    // 2. Filter by Search (Title or Date)
    const matchesSearch =
      group.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.date.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchRow}>
        <View style={styles.searchBar}>
          <Feather name="search" size={18} color="#666" />
          <TextInput
            placeholder="Search tasks..."
            placeholderTextColor="#666"
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity style={styles.filterBtn}>
          <Feather name="sliders" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        {["All", "Completed", "Previous", "Today", "Future"].map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <Text style={styles.sectionTitle}>{activeTab} Tasks</Text>

        {filteredTasks.length === 0 ? (
          <Text style={styles.emptyText}>No tasks found in this section.</Text>
        ) : (
          filteredTasks.map((group) => (
            <View key={group.id} style={styles.taskCard}>
              <View style={styles.taskHeader}>
                <View style={styles.iconCircle}>
                  <Feather
                    name={
                      getTaskCategory(group.date) === "Future"
                        ? "calendar"
                        : "clock"
                    }
                    size={16}
                    color="#007AFF"
                  />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.taskTitle}>{group.title}</Text>
                  <Text style={styles.taskSub}>
                    {group.date} • {group.todos.length} items
                  </Text>
                </View>
                <TouchableOpacity style={styles.radio}>
                  {group.completed && (
                    <Feather name="check" size={12} color="white" />
                  )}
                </TouchableOpacity>
              </View>

              {/* Nested Todo Preview */}
              <View style={styles.todoPreview}>
                {group.todos.slice(0, 2).map((todo, idx) => (
                  <Text key={idx} style={styles.todoText}>
                    • {todo.name}
                  </Text>
                ))}
                {group.todos.length > 2 && (
                  <Text style={styles.moreText}>
                    +{group.todos.length - 2} more...
                  </Text>
                )}
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", paddingHorizontal: 20 },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 10,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#1C1C1E",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
  },
  searchInput: { color: "white", marginLeft: 10, flex: 1 },
  filterBtn: {
    backgroundColor: "#1C1C1E",
    padding: 12,
    borderRadius: 12,
    marginLeft: 10,
  },
  tabRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
  },
  tab: { paddingBottom: 8 },
  activeTab: { borderBottomWidth: 2, borderBottomColor: "#007AFF" },
  tabText: { color: "#666", fontSize: 13, fontWeight: "500" },
  activeTabText: { color: "#fff" },
  sectionTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  taskCard: {
    backgroundColor: "#1C1C1E",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  taskHeader: { flexDirection: "row", alignItems: "center" },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#007AFF20",
    justifyContent: "center",
    alignItems: "center",
  },
  taskTitle: { color: "white", fontWeight: "bold", fontSize: 16 },
  taskSub: { color: "#666", fontSize: 12, marginTop: 2 },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#333",
    justifyContent: "center",
    alignItems: "center",
  },
  todoPreview: { marginTop: 12, paddingLeft: 48 },
  todoText: { color: "#AAA", fontSize: 13, marginBottom: 2 },
  moreText: { color: "#007AFF", fontSize: 12, marginTop: 4 },
  emptyText: { color: "#444", textAlign: "center", marginTop: 50 },
});
