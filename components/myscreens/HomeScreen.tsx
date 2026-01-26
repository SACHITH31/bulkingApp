import { Feather } from "@expo/vector-icons";
import React from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      {/* Search Bar from your design */}
      <View style={styles.searchRow}>
        <View style={styles.searchBar}>
          <Feather name="search" size={18} color="#666" />
          <TextInput
            placeholder="Search tasks..."
            placeholderTextColor="#666"
            style={styles.searchInput}
          />
        </View>
        <TouchableOpacity style={styles.filterBtn}>
          <Feather name="sliders" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        {["All", "Completed", "Previous", "Today", "Future"].map((tab, i) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, i === 3 && styles.activeTab]}
          >
            <Text style={[styles.tabText, i === 3 && styles.activeTabText]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Daily Tasks</Text>

        {/* Task Cards */}
        <View style={styles.taskCard}>
          <View style={styles.taskHeader}>
            <View style={styles.iconCircle}>
              <Feather name="zap" size={16} color="#FF9500" />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.taskTitle}>Calorie Intake</Text>
              <Text style={styles.taskSub}>2600 kcal Goal</Text>
            </View>
            <View style={styles.radio} />
          </View>
        </View>

        <View style={styles.taskCard}>
          <View style={styles.taskHeader}>
            <View style={[styles.iconCircle, { backgroundColor: "#34C75920" }]}>
              <Feather name="activity" size={16} color="#34C759" />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.taskTitle}>Heavy Lifting Session</Text>
              <Text style={styles.taskSub}>Focus on compound movements</Text>
            </View>
            <View style={[styles.radio, styles.radioChecked]}>
              <Feather name="check" size={12} color="white" />
            </View>
          </View>
        </View>
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
    backgroundColor: "#FF950020",
    justifyContent: "center",
    alignItems: "center",
  },
  taskTitle: { color: "white", fontWeight: "bold", fontSize: 15 },
  taskSub: { color: "#666", fontSize: 12, marginTop: 2 },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#333",
  },
  radioChecked: {
    backgroundColor: "#34C759",
    borderColor: "#34C759",
    justifyContent: "center",
    alignItems: "center",
  },
});
