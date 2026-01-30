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

// 3. The Logic Engine: Schedule 1hr and 30min before
export async function scheduleTodoReminders(
  todoTitle: string,
  targetTime: Date,
) {
  const now = new Date();

  // Calculate reminder times
  const oneHourBefore = new Date(targetTime.getTime() - 60 * 60 * 1000);
  const thirtyMinBefore = new Date(targetTime.getTime() - 30 * 60 * 1000);

  // Schedule "1 Hour Before" (Only if the time hasn't passed yet)
  if (oneHourBefore > now) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "⏳ 1 Hour Left",
        body: `Get ready: "${todoTitle}" is due in an hour.`,
        sound: true,
      },
      trigger: { date: oneHourBefore },
    });
  }

  // Schedule "30 Minutes Before"
  if (thirtyMinBefore > now) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "⚡ 30 Minutes Left",
        body: `Final push! "${todoTitle}" is coming up.`,
        sound: true,
      },
      trigger: { date: thirtyMinBefore },
    });
  }
}
