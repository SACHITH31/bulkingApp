import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

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
    return finalStatus === "granted";
  }
  return false;
}

export async function scheduleTodoReminders(
  todoTitle: string,
  targetTime: Date,
) {
  const now = new Date();
  const finalTrigger = new Date();

  // Set the hours and minutes from the picker onto a fresh date object
  finalTrigger.setHours(targetTime.getHours(), targetTime.getMinutes(), 0, 0);

  // If time passed today, move to tomorrow
  if (finalTrigger <= now) {
    finalTrigger.setDate(now.getDate() + 1);
  }

  const reminders = [
    { label: "NOW", minutes: 0, emoji: "🎯" },
    { label: "5 Minutes", minutes: 5, emoji: "🚨" },
    { label: "20 Minutes", minutes: 20, emoji: "🏃" },
  ];

  for (const reminder of reminders) {
    const reminderTime = new Date(
      finalTrigger.getTime() - reminder.minutes * 60 * 1000,
    );
    if (reminderTime > now) {
      try {
        await Notifications.scheduleNotificationAsync({
          content: {
            title:
              reminder.minutes === 0
                ? `🎯 ${todoTitle}`
                : `${reminder.emoji} ${reminder.label} Left`,
            body: `Don't forget your task! 💪`,
            sound: true,
            priority: Notifications.AndroidNotificationPriority.MAX,
          },
          trigger: { date: reminderTime },
        });
      } catch (e) {
        console.log("Reminder skipped");
      }
    }
  }
}
