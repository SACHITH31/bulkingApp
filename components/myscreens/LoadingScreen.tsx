import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

export default function LoadingScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current; // For the bar

  useEffect(() => {
    // 1. Logo Fade In
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // 2. Progress Bar Animation (Starting to End)
    // We set this to 4500ms so it finishes just before the app switches
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 4500,
      useNativeDriver: false, // Width doesn't support native driver
    }).start();
  }, []);

  // Interpolate the 0-1 value into a percentage width
  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity: fadeAnim, alignItems: "center" }}>
        <Text style={styles.logoText}>Bulking_App</Text>

        {/* The Track (Grey Background) */}
        <View style={styles.loaderLineContainer}>
          {/* The Filling Bar (Blue) */}
          <Animated.View
            style={[styles.progressFill, { width: progressWidth }]}
          />
        </View>
      </Animated.View>

      <Text style={styles.footerText}>FUEL YOUR GAINS..</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  logoText: {
    color: "white",
    fontSize: 42,
    fontWeight: "bold",
    letterSpacing: -1,
  },
  loaderLineContainer: {
    height: 4,
    width: 200,
    backgroundColor: "#1C1C1E", // Dark track
    marginTop: 30,
    borderRadius: 10,
    overflow: "hidden", // Ensures the blue bar stays inside
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#007AFF", // Blue color
    borderRadius: 10,
  },
  footerText: {
    position: "absolute",
    bottom: 50,
    color: "#cfcdcd",
    fontSize: 12,
    letterSpacing: 3,
    fontWeight: "600",
  },
});
