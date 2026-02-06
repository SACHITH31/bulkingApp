type WorkoutDay = {
  title: string;
  exercises: { name: string; reps: string; link: string }[];
  message?: string;
};

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export function getDayName(date: Date) {
  return DAYS[date.getDay()];
}

export const workoutPlan: Record<string, WorkoutDay> = {
  Monday: {
    title: "Full Body Strength",
    exercises: [
      {
        name: "Band Squat",
        reps: "3 x 12",
        link: "https://www.youtube.com/watch?v=NtgpX9twRmg",
      },
      {
        name: "Band Chest Press",
        reps: "3 x 12",
        link: "https://www.youtube.com/watch?v=NtgpX9twRmg",
      },
      {
        name: "Seated Band Row",
        reps: "3 x 12",
        link: "https://www.youtube.com/watch?v=Lk5PisETE9I",
      },
      {
        name: "Band Biceps Curl",
        reps: "3 x 12",
        link: "https://www.youtube.com/watch?v=Lk5PisETE9I",
      },
    ],
  },
  Tuesday: {
    title: "Upper Body",
    exercises: [
      {
        name: "Band Shoulder Press",
        reps: "3 x 12",
        link: "https://www.youtube.com/watch?v=NtgpX9twRmg",
      },
      {
        name: "Band Triceps Extension",
        reps: "3 x 12",
        link: "https://www.youtube.com/watch?v=Lk5PisETE9I",
      },
      {
        name: "Push-Ups",
        reps: "3 x 10",
        link: "https://www.youtube.com/watch?v=IODxDxX7oi4",
      },
      {
        name: "Plank",
        reps: "3 x 30 sec",
        link: "https://www.youtube.com/watch?v=pSHjTRCQxIw",
      },
    ],
  },
  Wednesday: {
    title: "Lower Body",
    exercises: [
      {
        name: "Band Deadlift",
        reps: "3 x 12",
        link: "https://www.youtube.com/watch?v=NtgpX9twRmg",
      },
      {
        name: "Glute Bridge",
        reps: "3 x 15",
        link: "https://www.youtube.com/watch?v=m2Zx-57cSok",
      },
      {
        name: "Band Lunges",
        reps: "3 x 10",
        link: "https://www.youtube.com/watch?v=QOVaHwm-Q6U",
      },
      {
        name: "Calf Raises",
        reps: "3 x 15",
        link: "https://www.youtube.com/watch?v=-M4-G8p8fmc",
      },
    ],
  },
  Thursday: {
    title: "REST DAY",
    exercises: [],
    message: "Light walking + stretching only",
  },
  Friday: {
    title: "Full Body",
    exercises: [
      {
        name: "Band Squat",
        reps: "4 x 12",
        link: "https://www.youtube.com/watch?v=NtgpX9twRmg",
      },
      {
        name: "Bent Over Row",
        reps: "4 x 12",
        link: "https://www.youtube.com/watch?v=Lk5PisETE9I",
      },
      {
        name: "Band Shoulder Press",
        reps: "3 x 12",
        link: "https://www.youtube.com/watch?v=NtgpX9twRmg",
      },
      {
        name: "Crunches",
        reps: "3 x 15",
        link: "https://www.youtube.com/watch?v=Xyd_fa5zoEU",
      },
    ],
  },
  Saturday: {
    title: "Light Cardio + Core",
    exercises: [
      {
        name: "Jumping Jacks",
        reps: "3 x 30 sec",
        link: "https://www.youtube.com/watch?v=c4DAnQ6DtF8",
      },
      {
        name: "Mountain Climbers",
        reps: "3 x 30 sec",
        link: "https://www.youtube.com/watch?v=nmwgirgXLYM",
      },
      {
        name: "Russian Twists",
        reps: "3 x 15",
        link: "https://www.youtube.com/watch?v=wkD8rjkodUI",
      },
      {
        name: "Leg Raises",
        reps: "3 x 12",
        link: "https://www.youtube.com/watch?v=JB2oyawG9KI",
      },
    ],
  },
  Sunday: {
    title: "REST DAY",
    exercises: [],
    message: "Complete Rest + Good Nutrition",
  },
};

export function getWorkoutForDate(date: Date) {
  const day = getDayName(date);
  return workoutPlan[day];
}
