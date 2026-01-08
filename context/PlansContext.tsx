"use client";

import { useState, createContext, useContext, useEffect } from "react";
import { useAuth } from "./AuthContext";

export interface MealPlan {
  id: string;
  name: string;
  createdAt: string;
  goal: string;
  dietType: string;
  calories: number;
  isActive: boolean;
  meals: {
    name: string;
    time: string;
    foods: {
      name: string;
      calories: number;
      protein: number;
      carbs: number;
      fats: number;
    }[];
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
  addMealPlan: (plan: MealPlan) => Promise<void>;
  addWorkoutPlan: (plan: WorkoutPlan) => Promise<void>;
  deleteMealPlan: (id: string) => Promise<void>;
  deleteWorkoutPlan: (id: string) => Promise<void>;
  setActiveMealPlan: (id: string, isActive: boolean) => Promise<void>;
  setActiveWorkoutPlan: (id: string, isActive: boolean) => Promise<void>;
  addWorkoutLog: (log: WorkoutLog) => void;
  isLoading: boolean;
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
  const { user } = useAuth();
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchPlans();
    } else {
      setMealPlans([]);
      setWorkoutPlans([]);
    }
  }, [user]);

  const fetchPlans = async () => {
    setIsLoading(true);
    try {
      const [mealsRes, workoutsRes] = await Promise.all([
        fetch("/api/plans/meal"),
        fetch("/api/plans/workout"),
      ]);

      if (mealsRes.ok) {
        const meals = await mealsRes.json();
        setMealPlans(meals);
      }
      if (workoutsRes.ok) {
        const workouts = await workoutsRes.json();
        setWorkoutPlans(workouts);
      }
    } catch (error) {
      console.error("Failed to fetch plans", error);
    } finally {
      setIsLoading(false);
    }
  };

  const addMealPlan = async (plan: MealPlan) => {
    try {
      const res = await fetch("/api/plans/meal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(plan),
      });
      if (res.ok) {
        const newPlan = await res.json();
        setMealPlans((prev) => [newPlan, ...prev]);
      }
    } catch (error) {
      console.error("Failed to add meal plan", error);
    }
  };

  const addWorkoutPlan = async (plan: WorkoutPlan) => {
    try {
      const res = await fetch("/api/plans/workout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(plan),
      });
      if (res.ok) {
        const newPlan = await res.json();
        setWorkoutPlans((prev) => [newPlan, ...prev]);
      }
    } catch (error) {
      console.error("Failed to add workout plan", error);
    }
  };

  const deleteMealPlan = async (id: string) => {
    try {
      await fetch(`/api/plans/meal/${id}`, { method: "DELETE" });
      setMealPlans((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Failed to delete meal plan", error);
    }
  };

  const deleteWorkoutPlan = async (id: string) => {
    try {
      await fetch(`/api/plans/workout/${id}`, { method: "DELETE" });
      setWorkoutPlans((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Failed to delete workout plan", error);
    }
  };

  const setActiveMealPlan = async (id: string, isActive: boolean) => {
    try {
      const res = await fetch(`/api/plans/meal/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive }),
      });

      if (res.ok) {
        setMealPlans((prev) =>
          prev.map((p) => {
            if (isActive) {
              // If activating, deactivate others
              return { ...p, isActive: p.id === id };
            } else {
              // If deactivating, just deactivate target
              return p.id === id ? { ...p, isActive: false } : p;
            }
          })
        );
      }
    } catch (error) {
      console.error("Failed to set active meal plan", error);
    }
  };

  const setActiveWorkoutPlan = async (id: string, isActive: boolean) => {
    try {
      const res = await fetch(`/api/plans/workout/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive }),
      });

      if (res.ok) {
        setWorkoutPlans((prev) =>
          prev.map((p) => {
            if (isActive) {
              return { ...p, isActive: p.id === id };
            } else {
              return p.id === id ? { ...p, isActive: false } : p;
            }
          })
        );
      }
    } catch (error) {
      console.error("Failed to set active workout plan", error);
    }
  };

  const addWorkoutLog = (log: WorkoutLog) => {
    setWorkoutLogs((prev) => [...prev, log]);
  };

  const activeMealPlan = mealPlans.find((p) => p.isActive) || null;
  const activeWorkoutPlan = workoutPlans.find((p) => p.isActive) || null;

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
        isLoading,
      }}
    >
      {children}
    </PlansContext.Provider>
  );
};
