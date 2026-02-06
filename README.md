# MassFlow

MassFlow is a focused bulking companion built with Expo and React Native. It helps users plan meals, track daily nutrition, manage task groups with reminders, follow a simple workout plan, and log weight progress. The app is optimized for Android and uses local notifications only.

**What the app does**

1. **Task groups with todo reminders**
   Create a task group (e.g., "Morning Routine") and add multiple todos with their own times. The app schedules reminders 60, 30, and 5 minutes before each todo.
2. **Fixed daily meal reminders**
   Daily reminders for:
   - 7:30 AM Breakfast
   - 10:40 AM College Snack
   - 1:00 PM Lunch
   - 4:30 PM Evening Snack
   - 8:30 PM Dinner
     If a meal plan exists, the reminder includes what to eat.
3. **Daily nutrition summary**
   At 10:30 PM, the app shows a summary notification with total kcal and protein for the day.
4. **Morning workout reminder**
   A 6:30 AM reminder with today’s workout title (or rest day message).
5. **Food tracking**
   Track items per meal, compute total kcal and protein, and save the daily summary.
6. **Workout screen**
   Displays a simple weekly plan with exercises and links.
7. **Weight tracking**
   Log daily weight changes and see progress toward a goal.

**Tech stack**

1. Expo + React Native
2. TypeScript
3. `expo-notifications` (local notifications)
4. `@react-native-async-storage/async-storage` (local persistence)

**Data storage keys**

1. `@task_groups` — task groups and todos
2. `@diet_plan_state` — meal plan and completed items
3. `@daily_summary` — daily kcal and protein totals
4. `@weight_history` — weight log

**Notification system (Android only)**

1. Uses `expo-notifications`
2. Local notifications only
3. Deduplicated scheduling with per-item IDs
4. Old schedules are canceled before rescheduling

**Project structure**

1. `app/` — app entry and layout
2. `components/myscreens/` — main screens (Home, Food, Work, Weight, AddTask)
3. `utils/notifications.ts` — centralized notification logic
4. `utils/workoutPlan.ts` — shared workout plan
5. `assets/` — images and icons

**Run locally**

1. Install dependencies
   ```bash
   npm install
   ```
2. Start the app
   ```bash
   npx expo start
   ```

**Notes**

1. The app is designed for Android devices.
2. Notifications are scheduled locally and survive APK builds.
3. No backend is required.
