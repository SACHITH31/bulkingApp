import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

// 1. Configure Notification Behavior (Head-up alerts, Sound, Badge)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// 2. Default Workout Schedule (Used for the 5:30 PM reminder)
const DEFAULT_WORKOUT_PLAN: any = {
  Monday: { title: "Full Body Strength", exercises: [1] },
  Tuesday: { title: "Upper Body", exercises: [1] },
  Wednesday: { title: "Lower Body", exercises: [1] },
  Thursday: { title: "REST DAY", exercises: [] },
  Friday: { title: "Full Body", exercises: [1] },
  Saturday: { title: "Light Cardio", exercises: [1] },
  Sunday: { title: "REST DAY", exercises: [] },
};

// 3. Permission Request Handler
export async function registerForPushNotificationsAsync() {
  if (!Device.isDevice) return false;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
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

// 4. The MASTER Sync Function
export async function syncAllNotifications() {
  // A. Clear all previous schedules to prevent duplicates
  await Notifications.cancelAllScheduledNotificationsAsync();

  // B. Schedule Fixed Meal Reminders
  const meals = [
    {
      title: "🍳 Breakfast Time",
      body: "Fuel up! Time for your morning meal.",
      h: 8,
      m: 30,
    },
    {
      title: "🥗 Lunch Time",
      body: "Don't skip your midday nutrition!",
      h: 13,
      m: 30,
    },
    {
      title: "🍽️ Dinner Time",
      body: "Evening meal time. Keep that bulk going!",
      h: 20,
      m: 0,
    },
  ];

  for (const m of meals) {
    await Notifications.scheduleNotificationAsync({
      content: { title: m.title, body: m.body, sound: true },
      trigger: { hour: m.h, minute: m.m, repeats: true },
    });
  }

  // C. Schedule Dynamic Workout Reminder (5:30 PM)
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const todayName = days[new Date().getDay()];
  const workout = DEFAULT_WORKOUT_PLAN[todayName];

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "💪 Workout Time!",
      body:
        workout?.exercises?.length > 0
          ? `Time for ${workout.title}! Let's hit the gym.`
          : `Today is Rest Day. Do some light stretching!`,
      sound: true,
    },
    trigger: { hour: 17, minute: 30, repeats: true },
  });

  // D. Schedule Daily Nutrition Summary (10:30 PM)
  // We read the latest data from AsyncStorage
  const savedFood = await AsyncStorage.getItem("@food_logs"); // Assuming you save logs here or we calculate from plan
  // Fallback: Calculate from the current day's summary key you used in FoodScreen
  const summaryStr = await AsyncStorage.getItem("@daily_summary");
  const summary = summaryStr ? JSON.parse(summaryStr) : { kcal: 0, protein: 0 };

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "📊 Daily Summary",
      body: `Total Today: ${summary.kcal} kcal and ${summary.protein}g Protein. Great work!`,
      sound: true,
    },
    trigger: { hour: 22, minute: 30, repeats: true },
  });

  // E. Schedule Todo Reminders (1hr, 30m, 5m, NOW)
  const savedTaskGroups = await AsyncStorage.getItem("@task_groups");
  const taskGroups = savedTaskGroups ? JSON.parse(savedTaskGroups) : [];
  const now = new Date();

  // Iterate through all groups and their nested todos
  for (const group of taskGroups) {
    if (!group.todos) continue;

    for (const todo of group.todos) {
      if (!todo.time) continue;

      const taskTime = new Date(todo.time);

      // If the task is in the past, skip it
      if (taskTime <= now) continue;

      const intervals = [
        { mins: 60, label: "1 hour" },
        { mins: 30, label: "30 minutes" },
        { mins: 5, label: "5 minutes" },
        { mins: 0, label: "NOW" },
      ];

      for (const interval of intervals) {
        const triggerTime = new Date(
          taskTime.getTime() - interval.mins * 60000,
        );

        // Only schedule if the trigger time is still in the future
        if (triggerTime > now) {
          await Notifications.scheduleNotificationAsync({
            content: {
              title:
                interval.mins === 0
                  ? `🎯 Start: ${todo.name}`
                  : `⏳ ${interval.label} Left: ${todo.name}`,
              body:
                interval.mins === 0
                  ? "Time to crush this task!"
                  : `"${todo.name}" starts soon.`,
              sound: true,
              data: { todoId: todo.id },
            },
            trigger: { date: triggerTime },
          });
        }
      }
    }
  }
}
