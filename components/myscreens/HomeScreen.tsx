import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function HomeScreen({ onEditTask }: any) {
  const isFocused = useIsFocused();
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [allTaskGroups, setAllTaskGroups] = useState<any[]>([]);

  // Refresh data every time the screen comes into focus
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

  // CORE LOGIC: Determines which tab a task belongs to based on the ISO date string
  const getTaskCategory = (taskISO: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const taskDate = new Date(taskISO);
    taskDate.setHours(0, 0, 0, 0);

    if (taskDate.getTime() === today.getTime()) return "Today";
    if (taskDate.getTime() < today.getTime()) return "Previous";
    return "Future";
  };

  const deleteGroup = async (id: string) => {
    Alert.alert("Delete Task", "Are you sure you want to delete this group?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const updated = allTaskGroups.filter((g) => g.id !== id);
          setAllTaskGroups(updated);
          await AsyncStorage.setItem("@task_groups", JSON.stringify(updated));
        },
      },
    ]);
  };

  const toggleComplete = async (id: string) => {
    const updated = allTaskGroups.map((g) =>
      g.id === id ? { ...g, completed: !g.completed } : g,
    );
    setAllTaskGroups(updated);
    await AsyncStorage.setItem("@task_groups", JSON.stringify(updated));
  };

  const filteredTasks = allTaskGroups.filter((group) => {
    const category = getTaskCategory(group.date);

    // 1. Tab Filtering Logic
    let matchesTab = false;
    if (activeTab === "All") {
      // "All" shows everything from the past up to today, but NOT the future
      matchesTab = category === "Today" || category === "Previous";
    } else if (activeTab === "Previous") {
      matchesTab = category === "Previous";
    } else if (activeTab === "Today") {
      matchesTab = category === "Today";
    } else if (activeTab === "Future") {
      matchesTab = category === "Future";
    } else if (activeTab === "Completed") {
      matchesTab = group.completed === true;
    }

    // 2. Search Filtering Logic (Search within the selected section only)
    const matchesSearch =
      group.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      new Date(group.date)
        .toDateString()
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchRow}>
        <View style={styles.searchBar}>
          <Feather name="search" size={18} color="#666" />
          <TextInput
            placeholder="Search in this section..."
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

      {/* Tabs Navigation */}
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
          <View style={styles.emptyContainer}>
            <Feather name="inbox" size={40} color="#333" />
            <Text style={styles.emptyText}>No tasks found in {activeTab}</Text>
          </View>
        ) : (
          filteredTasks.map((group) => (
            <View key={group.id} style={styles.taskCard}>
              <View style={styles.taskHeader}>
                {/* Completion Icon Circle */}
                <TouchableOpacity
                  style={[
                    styles.iconCircle,
                    group.completed && styles.iconCircleChecked,
                  ]}
                  onPress={() => toggleComplete(group.id)}
                >
                  <Feather
                    name={group.completed ? "check" : "calendar"}
                    size={16}
                    color={group.completed ? "#34C759" : "#007AFF"}
                  />
                </TouchableOpacity>

                {/* Task Details */}
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text
                    style={[
                      styles.taskTitle,
                      group.completed && styles.textCompleted,
                    ]}
                  >
                    {group.title}
                  </Text>
                  <Text style={styles.taskSub}>
                    {new Date(group.date).toDateString()} • {group.todos.length}{" "}
                    items
                  </Text>
                </View>

                {/* Actions: Edit and Delete */}
                <View style={styles.actionRow}>
                  <TouchableOpacity
                    onPress={() => onEditTask(group)}
                    style={styles.actionBtn}
                  >
                    <Feather name="edit-2" size={18} color="#AAA" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => deleteGroup(group.id)}
                    style={styles.actionBtn}
                  >
                    <Feather name="trash-2" size={18} color="#FF3B30" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Nested Todos Preview */}
              <View style={styles.todoPreview}>
                {group.todos.slice(0, 2).map((todo: any, idx: number) => (
                  <Text key={idx} style={styles.todoText}>
                    • {todo.name}
                  </Text>
                ))}
                {group.todos.length > 2 && (
                  <Text style={styles.moreText}>
                    +{group.todos.length - 2} more items
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
  iconCircleChecked: { backgroundColor: "#34C75920" },
  taskTitle: { color: "white", fontWeight: "bold", fontSize: 16 },
  textCompleted: { textDecorationLine: "line-through", color: "#666" },
  taskSub: { color: "#666", fontSize: 12, marginTop: 2 },
  actionRow: { flexDirection: "row" },
  actionBtn: { marginLeft: 15 },
  todoPreview: { marginTop: 12, paddingLeft: 48 },
  todoText: { color: "#AAA", fontSize: 13, marginBottom: 2 },
  moreText: { color: "#007AFF", fontSize: 12, marginTop: 4 },
  emptyContainer: { alignItems: "center", marginTop: 60 },
  emptyText: { color: "#444", marginTop: 10, fontSize: 16 },
});
