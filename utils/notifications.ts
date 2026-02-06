import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { getWorkoutForDate } from "./workoutPlan";

const ANDROID_CHANNEL_ID = "default";

const STORAGE_KEYS = {
  mealIds: "@notif_meal_ids",
  summaryId: "@notif_summary_id",
  workoutId: "@notif_workout_id",
  todoIdsPrefix: "@notif_todo_ids_",
};

let syncPromise: Promise<void> | null = null;

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
    await Notifications.setNotificationChannelAsync(ANDROID_CHANNEL_ID, {
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

async function cancelNotificationIds(ids: string[] | null | undefined) {
  if (!ids || ids.length === 0) return;
  await Promise.all(
    ids.map((id) =>
      Notifications.cancelScheduledNotificationAsync(id).catch(() => null),
    ),
  );
}

async function cancelStoredIds(key: string) {
  const raw = await AsyncStorage.getItem(key);
  if (!raw) return;
  const ids = JSON.parse(raw) as string[];
  await cancelNotificationIds(ids);
  await AsyncStorage.removeItem(key);
}

async function scheduleMealReminders() {
  await cancelStoredIds(STORAGE_KEYS.mealIds);

  const meals = [
    { period: "Breakfast", title: "🍳 Breakfast Time", hour: 7, minute: 30 },
    {
      period: "College Snack",
      title: "🥪 College Snack",
      hour: 10,
      minute: 40,
    },
    { period: "Lunch", title: "🍲 Lunch Time", hour: 13, minute: 0 },
    {
      period: "Evening Snack",
      title: "🥤 Evening Snack",
      hour: 16,
      minute: 30,
    },
    { period: "Dinner", title: "🍽️ Dinner Time", hour: 20, minute: 30 },
  ];

  let planItemsByPeriod: Record<string, string[]> = {};
  try {
    const rawPlan = await AsyncStorage.getItem("@diet_plan_state");
    if (rawPlan) {
      const plan = JSON.parse(rawPlan);
      planItemsByPeriod = plan.reduce((acc: any, p: any) => {
        acc[p.period] = (p.items || []).map((i: any) => i.name);
        return acc;
      }, {});
    }
  } catch {
    // ignore parse errors
  }

  const ids: string[] = [];
  for (const meal of meals) {
    const items = planItemsByPeriod[meal.period];
    const body =
      items && items.length > 0
        ? `Eat: ${items.slice(0, 4).join(", ")}`
        : "Time to eat and refuel.";

    const trigger = { type: "daily", hour: meal.hour, minute: meal.minute };
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: meal.title,
        body,
        sound: true,
        channelId: ANDROID_CHANNEL_ID,
      },
      trigger,
    });
    ids.push(id);
  }

  await AsyncStorage.setItem(STORAGE_KEYS.mealIds, JSON.stringify(ids));
  console.log("Scheduled meal reminders:", ids.length);
}

async function scheduleDailySummary() {
  await cancelStoredIds(STORAGE_KEYS.summaryId);

  const now = new Date();
  const target = new Date(now);
  target.setHours(22, 30, 0, 0);
  if (target <= now) target.setDate(target.getDate() + 1);

  let kcal = 0;
  let protein = 0;
  try {
    const raw = await AsyncStorage.getItem("@daily_summary");
    if (raw) {
      const summary = JSON.parse(raw);
      kcal = summary.kcal || 0;
      protein = summary.protein || 0;
    }
  } catch {
    // ignore parse errors
  }

  const summaryTrigger = { type: "date", date: target };
  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: "📊 Daily Nutrition Summary",
      body: `Today: ${kcal} kcal, ${protein}g protein.`,
      sound: true,
      channelId: ANDROID_CHANNEL_ID,
    },
    trigger: summaryTrigger,
  });

  await AsyncStorage.setItem(STORAGE_KEYS.summaryId, JSON.stringify([id]));
  console.log("Scheduled daily summary:", target.toISOString());
}

async function scheduleWorkoutReminder() {
  await cancelStoredIds(STORAGE_KEYS.workoutId);

  const now = new Date();
  const target = new Date(now);
  target.setHours(6, 30, 0, 0);
  if (target <= now) target.setDate(target.getDate() + 1);

  const workout = getWorkoutForDate(target);
  const title = workout?.title || "Workout";
  const body =
    workout?.message ||
    (title.toUpperCase().includes("REST") ? "Recovery day." : "Get moving!");

  const workoutTrigger = { type: "date", date: target };
  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: `🏋️ ${title}`,
      body,
      sound: true,
      channelId: ANDROID_CHANNEL_ID,
    },
    trigger: workoutTrigger,
  });

  await AsyncStorage.setItem(STORAGE_KEYS.workoutId, JSON.stringify([id]));
  console.log("Scheduled workout reminder:", target.toISOString());
}

async function cancelTodoNotifications(todoId: string) {
  const key = `${STORAGE_KEYS.todoIdsPrefix}${todoId}`;
  const raw = await AsyncStorage.getItem(key);
  if (!raw) return;
  const ids = JSON.parse(raw) as string[];
  await cancelNotificationIds(ids);
  await AsyncStorage.removeItem(key);
}

async function scheduleTodoNotifications(todo: any, groupId: string) {
  const taskDate = new Date(todo.time);
  taskDate.setSeconds(0, 0);

  const now = new Date();
  const bufferTime = now.getTime() + 5000;

  const stages = [
    { minutes: 60, label: "⏳ 1 hour Left", msg: "Starts soon!" },
    { minutes: 30, label: "⏳ 30 mins Left", msg: "Get ready!" },
    { minutes: 5, label: "⏳ 5 mins Left", msg: "Almost time!" },
  ];

  const ids: string[] = [];
  for (const stage of stages) {
    const triggerTime = new Date(taskDate.getTime() - stage.minutes * 60000);
    if (triggerTime.getTime() > bufferTime) {
      const todoTrigger = { type: "date", date: triggerTime };
      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: `${stage.label}: ${todo.name}`,
          body: stage.msg,
          data: { taskId: groupId, todoId: todo.id },
          sound: true,
          channelId: ANDROID_CHANNEL_ID,
        },
        trigger: todoTrigger,
      });
      ids.push(id);
    }
  }

  await AsyncStorage.setItem(
    `${STORAGE_KEYS.todoIdsPrefix}${todo.id}`,
    JSON.stringify(ids),
  );
  console.log(
    `Scheduled todo reminders for ${todo.id}: ${ids.length} triggers`,
  );
}

async function syncTodoReminders() {
  const raw = await AsyncStorage.getItem("@task_groups");
  const groups = raw ? JSON.parse(raw) : [];

  const activeTodoIds = new Set<string>();
  for (const group of groups) {
    if (!group.todos) continue;
    for (const todo of group.todos) {
      activeTodoIds.add(todo.id);
    }
  }

  const allKeys = await AsyncStorage.getAllKeys();
  const todoKeys = allKeys.filter((k) =>
    k.startsWith(STORAGE_KEYS.todoIdsPrefix),
  );

  for (const key of todoKeys) {
    const todoId = key.replace(STORAGE_KEYS.todoIdsPrefix, "");
    if (!activeTodoIds.has(todoId)) {
      await cancelTodoNotifications(todoId);
      console.log("Cancelled stale todo reminders:", todoId);
    }
  }

  for (const group of groups) {
    if (group.completed) continue;
    for (const todo of group.todos || []) {
      if (todo.completed) {
        await cancelTodoNotifications(todo.id);
        continue;
      }
      await cancelTodoNotifications(todo.id);
      if (todo.time) {
        await scheduleTodoNotifications(todo, group.id);
      }
    }
  }
}

// 3. The Master Sync Function
export async function syncAllNotifications() {
  if (Platform.OS !== "android") return;

  if (syncPromise) return syncPromise;
  syncPromise = (async () => {
    try {
      await scheduleMealReminders();
      await scheduleDailySummary();
      await scheduleWorkoutReminder();
      await syncTodoReminders();
      console.log("Notification sync complete");
    } catch (globalError) {
      console.error("Critical Sync Error:", globalError);
    } finally {
      syncPromise = null;
    }
  })();

  return syncPromise;
}
