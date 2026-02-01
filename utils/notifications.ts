import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

// 1. Setup global notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// 2. Register Permissions & Channels
export async function registerForPushNotificationsAsync() {
  if (!Device.isDevice) return false;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "MassFlow Reminders",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  return finalStatus === "granted";
}

// 3. The Master Sync Function
export async function syncAllNotifications() {
  try {
    // STEP 1: Wipe all previous/stale notifications
    await Notifications.cancelAllScheduledNotificationsAsync();

    const now = new Date();
    // Safety buffer: 5 seconds in the future
    const bufferTime = now.getTime() + 5000;

    // --- PART A: MEAL REMINDERS ---
    // --- PART A: MEAL REMINDERS ---
    const mealTimes = [
      {
        title: "🍳 Breakfast Time",
        body: "Fuel up for the day!",
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
        title: "🍽️ Dinner Time",
        body: "Time for your evening meal.",
        hour: 20,
        minute: 0,
      },
    ];

    for (const meal of mealTimes) {
      const now = new Date();
      const mealToday = new Date();
      mealToday.setHours(meal.hour, meal.minute, 0, 0);

      // If the meal time has already passed today (e.g., it's 9:38 AM and meal was 8:30 AM)
      // we schedule it specifically for TOMORROW to avoid the immediate pop-up.
      let trigger;
      if (now > mealToday) {
        // Already passed today, schedule for tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(meal.hour, meal.minute, 0, 0);

        trigger = {
          date: tomorrow,
          repeats: true, // Expo will continue daily after this date
          channelId: "default",
        };
      } else {
        // Still in the future today
        trigger = {
          hour: meal.hour,
          minute: meal.minute,
          repeats: true,
          channelId: "default",
        };
      }

      await Notifications.scheduleNotificationAsync({
        content: {
          title: meal.title,
          body: meal.body,
          sound: true,
        },
        trigger: trigger as any,
      }).catch((e) => console.log("Meal error skipped"));
    }

    // --- PART B: TODO REMINDERS ---
    const data = await AsyncStorage.getItem("@task_groups");
    if (!data) return;

    const groups = JSON.parse(data);

    for (const group of groups) {
      if (group.completed) continue;

      for (const todo of group.todos) {
        // We assume todo.completed might not exist yet, so we check if it's there
        if (todo.completed) continue;

        const taskDate = new Date(todo.time);
        taskDate.setSeconds(0, 0);

        const scheduleStage = async (
          minutesBefore: number,
          label: string,
          msg: string,
        ) => {
          const triggerTime = new Date(
            taskDate.getTime() - minutesBefore * 60000,
          );

          // ONLY schedule if triggerTime is actually in the future (past the buffer)
          if (triggerTime.getTime() > bufferTime) {
            await Notifications.scheduleNotificationAsync({
              content: {
                title: `${label}: ${todo.name}`,
                body: msg,
                data: { taskId: group.id },
              },
              trigger: { date: triggerTime },
            }).catch((err) => console.log("Stage schedule error skipped"));
          }
        };

        // Stages: 1hr, 30m, 5m, and Start
        await scheduleStage(60, "⏳ 1 hour Left", "Starts soon!");
        await scheduleStage(30, "⏳ 30 mins Left", "Get ready!");
        await scheduleStage(5, "⏳ 5 mins Left", "Almost time!");
        await scheduleStage(0, "🎯 Start", "Time to crush this task!");
      }
    }
  } catch (globalError) {
    console.error("Critical Sync Error:", globalError);
  }
}
