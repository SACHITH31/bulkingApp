import * as Notifications from "expo-notifications";
import { Stack } from "expo-router";
import { useEffect } from "react";
import {
  registerForPushNotificationsAsync,
  syncAllNotifications,
} from "../utils/notifications";

export default function RootLayout() {
  useEffect(() => {
    async function setupNotifications() {
      const isGranted = await registerForPushNotificationsAsync();
      if (isGranted) {
        // Sync triggers immediately on app launch to ensure everything is up to date
        await syncAllNotifications();
        console.log("Notifications scheduled successfully");
      }
    }

    setupNotifications();

    // Listener for when a notification is received while app is open
    const subscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("Notification received in foreground:", notification);
      },
    );

    return () => subscription.remove();
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
    </Stack>
  );
}
