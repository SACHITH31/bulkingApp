import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Alert, Platform } from "react-native";

// 1. Configure how notifications appear when the app is OPEN
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// 2. The Permission & Channel Setup (Critical for Android 13+)
export async function registerForPushNotificationsAsync() {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      Alert.alert(
        "Permission needed",
        "Enable notifications to get reminders for your habits!",
      );
      return false;
    }
    return true;
  }

  return false; // Simulator/Emulator handling
}

// 3. The Logic Engine: Multi-stage Reminders
export async function scheduleTodoReminders(
  todoTitle: string,
  targetTime: Date,
) {
  const now = new Date();

  // Define our reminder offsets in minutes
  const reminders = [
    { label: "1 Hour", minutes: 60, emoji: "⏳" },
    { label: "30 Minutes", minutes: 30, emoji: "⚡" },
    { label: "20 Minutes", minutes: 20, emoji: "🏃" },
    { label: "5 Minutes", minutes: 5, emoji: "🚨" },
  ];

  let scheduledCount = 0;

  for (const reminder of reminders) {
    const reminderTime = new Date(
      targetTime.getTime() - reminder.minutes * 60 * 1000,
    );

    // Only schedule if the reminder time is still in the future
    if (reminderTime > now) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `${reminder.emoji} ${reminder.label} Left`,
          body: `Keep going! "${todoTitle}" starts in ${reminder.label}.`,
          sound: true,
          priority: Notifications.AndroidImportance.MAX,
        },
        trigger: { date: reminderTime },
      });
      scheduledCount++;
    }
  }

  console.log(
    `[MassFlow] Scheduled ${scheduledCount} alerts for: ${todoTitle}`,
  );
}
