import React, { useEffect, useRef } from "react";
import { Animated, StatusBar, StyleSheet, Text, View } from "react-native";

export default function LoadingScreen() {
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Logo entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();

    // Bottom progress bar animation (5 seconds)
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 5000,
      useNativeDriver: false,
    }).start();
  }, [fadeAnim, progressAnim, scaleAnim]);

  const progressBarWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* 3. The Animated Logo Area */}
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
          alignItems: "center",
        }}
      >
        <View style={styles.logoWrapper}>
          {/* <Image
            source={require("../../assets/logo.jpeg")} // Make sure path is correct
            style={styles.logoImage}
            resizeMode="contain"
          /> */}
        </View>
        <Text style={styles.appName}>
          Mass<Text style={styles.highlight}>Flow</Text>
        </Text>
      </Animated.View>

      {/* Loading Bar at bottom */}
      <View style={styles.loaderContainer}>
        <View style={styles.track}>
          <Animated.View style={[styles.fill, { width: progressBarWidth }]} />
        </View>
        <Text style={styles.loadingText}>PREPARING YOUR WORKOUT...</Text>
      </View>
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
  logoWrapper: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  // logoImage: { width: "100%", height: "100%", borderRadius: 80 },
  appName: {
    color: "white",
    fontSize: 42,
    fontWeight: "bold",
    letterSpacing: -1,
  },
  highlight: { color: "#00FFCC" }, // Neon green/blue from logo
  loaderContainer: {
    position: "absolute",
    bottom: 100,
    width: "80%",
    alignItems: "center",
  },
  track: {
    width: "100%",
    height: 4,
    backgroundColor: "#1C1C1E",
    borderRadius: 2,
    overflow: "hidden",
  },
  fill: { height: "100%", backgroundColor: "#00FFCC" },
  loadingText: {
    color: "#a5a4a4",
    fontSize: 10,
    marginTop: 15,
    letterSpacing: 3,
    fontWeight: "bold",
  },
});
