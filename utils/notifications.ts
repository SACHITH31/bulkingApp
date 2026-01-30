import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

// 1. Set the global handler to show alerts while the app is open
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// 2. Register Device for Notifications
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

// 3. DAILY HEALTH & WORKOUT REMINDERS (Recurring every day)
export async function scheduleDailyHealthReminders() {
  // Clear existing to avoid duplicates
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  for (const n of scheduled) {
    if (n.content.categoryIdentifier === "daily-health") {
      await Notifications.cancelScheduledNotificationAsync(n.identifier);
    }
  }

  const dailyReminders = [
    {
      title: "🍳 Breakfast Time",
      body: "Fuel up! Time for your morning meal.",
      hour: 8,
      minute: 30,
    },
    {
      title: "🥗 Lunch Time",
      body: "Don't skip your midday nutrition!",
      hour: 13,
      minute: 30,
    },
    {
      title: "💪 Workout Time!",
      body: "Time to hit the gym and crush those goals!",
      hour: 17,
      minute: 30,
    }, // 5:30 PM
    {
      title: "🍽️ Dinner Time",
      body: "Evening meal time. Keep that bulk going!",
      hour: 20,
      minute: 0,
    },
    {
      title: "📊 Daily Summary",
      body: "Check your total protein & kcal intake for today!",
      hour: 22,
      minute: 30,
    }, // 10:30 PM
  ];

  for (const r of dailyReminders) {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: r.title,
          body: r.body,
          categoryIdentifier: "daily-health",
        },
        trigger: {
          hour: r.hour,
          minute: r.minute,
          repeats: true,
        },
      });
    } catch (e) {
      console.error("Error scheduling daily reminder:", e);
    }
  }
}

// 4. TASK SPECIFIC REMINDERS (1hr, 30min, 5min, Start)
export async function scheduleTodoReminders(
  todoTitle: string,
  targetTime: Date,
) {
  const now = new Date();

  // Create the base date for the trigger
  const finalTrigger = new Date();
  finalTrigger.setHours(targetTime.getHours(), targetTime.getMinutes(), 0, 0);

  // If time has already passed today, the UI logic expects it for tomorrow
  if (finalTrigger <= now) {
    finalTrigger.setDate(now.getDate() + 1);
  }

  const reminders = [
    { label: "1 Hour", minutes: 60, emoji: "⏳" },
    { label: "30 Minutes", minutes: 30, emoji: "🏃" },
    { label: "5 Minutes", minutes: 5, emoji: "🚨" },
    { label: "NOW", minutes: 0, emoji: "🎯" },
  ];

  for (const reminder of reminders) {
    const reminderTime = new Date(
      finalTrigger.getTime() - reminder.minutes * 60 * 1000,
    );

    // Only schedule if the warning time is still in the future
    if (reminderTime > now) {
      try {
        await Notifications.scheduleNotificationAsync({
          content: {
            title:
              reminder.minutes === 0
                ? `${reminder.emoji} ${todoTitle}`
                : `${reminder.emoji} ${reminder.label} Left`,
            body:
              reminder.minutes === 0
                ? `Time to start your task! 💪`
                : `"${todoTitle}" starts in ${reminder.label}.`,
            sound: true,
            priority: Notifications.AndroidNotificationPriority.MAX,
          },
          trigger: { date: reminderTime },
        });
      } catch (e) {
        console.log("Skipped a reminder calculation error");
      }
    }
  }
}
