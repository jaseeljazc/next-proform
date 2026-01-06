"use client";

import { useState, createContext, useContext } from "react";


export interface MealPlan {
  id: string;
  name: string;
  createdAt: string;
  goal: string;
  dietType: string;
  calories: number;
  meals: {
    name: string;
    time: string;
    foods: { name: string; calories: number; protein: number; carbs: number; fats: number }[];
  }[];
}

export interface WorkoutPlan {
  id: string;
  name: string;
  createdAt: string;
  goal: string;
  split: string;
  isActive: boolean;
  days: {
    day: string;
    name: string;
    exercises: { name: string; sets: number; reps: string; rest: string }[];
  }[];
}

export interface WorkoutLog {
  id: string;
  date: string;
  week: number;
  dayName: string;
  exercises: { name: string; sets: { reps: number; weight: number }[] }[];
}

interface PlansContextType {
  mealPlans: MealPlan[];
  workoutPlans: WorkoutPlan[];
  workoutLogs: WorkoutLog[];
  activeMealPlan: MealPlan | null;
  activeWorkoutPlan: WorkoutPlan | null;
  addMealPlan: (plan: MealPlan) => void;
  addWorkoutPlan: (plan: WorkoutPlan) => void;
  deleteMealPlan: (id: string) => void;
  deleteWorkoutPlan: (id: string) => void;
  setActiveMealPlan: (id: string) => void;
  setActiveWorkoutPlan: (id: string) => void;
  addWorkoutLog: (log: WorkoutLog) => void;
}

const PlansContext = createContext<PlansContextType | null>(null);

export const usePlans = () => {
  const context = useContext(PlansContext);
  if (!context) {
    throw new Error("usePlans must be used within a PlansProvider");
  }
  return context;
};

export const PlansProvider = ({ children }: { children: React.ReactNode }) => {
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>([]);
  const [activeMealPlanId, setActiveMealPlanId] = useState<string | null>(null);
  const [activeWorkoutPlanId, setActiveWorkoutPlanId] = useState<string | null>(null);

  const addMealPlan = (plan: MealPlan) => {
    setMealPlans((prev) => [...prev, plan]);
  };

  const addWorkoutPlan = (plan: WorkoutPlan) => {
    setWorkoutPlans((prev) => [...prev, plan]);
  };

  const deleteMealPlan = (id: string) => {
    setMealPlans((prev) => prev.filter((p) => p.id !== id));
    if (activeMealPlanId === id) setActiveMealPlanId(null);
  };

  const deleteWorkoutPlan = (id: string) => {
    setWorkoutPlans((prev) => prev.filter((p) => p.id !== id));
    if (activeWorkoutPlanId === id) setActiveWorkoutPlanId(null);
  };

  const setActiveMealPlan = (id: string) => {
    setActiveMealPlanId(id);
  };

  const setActiveWorkoutPlan = (id: string) => {
    setActiveWorkoutPlanId(id);
    setWorkoutPlans((prev) =>
      prev.map((p) => ({ ...p, isActive: p.id === id }))
    );
  };

  const addWorkoutLog = (log: WorkoutLog) => {
    setWorkoutLogs((prev) => [...prev, log]);
  };

  const activeMealPlan = mealPlans.find((p) => p.id === activeMealPlanId) || null;
  const activeWorkoutPlan = workoutPlans.find((p) => p.id === activeWorkoutPlanId) || null;

  return (
    <PlansContext.Provider
      value={{
        mealPlans,
        workoutPlans,
        workoutLogs,
        activeMealPlan,
        activeWorkoutPlan,
        addMealPlan,
        addWorkoutPlan,
        deleteMealPlan,
        deleteWorkoutPlan,
        setActiveMealPlan,
        setActiveWorkoutPlan,
        addWorkoutLog,
      }}
    >
      {children}
    </PlansContext.Provider>
  );
};
