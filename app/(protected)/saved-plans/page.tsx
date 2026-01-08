"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Utensils,
  Dumbbell,
  Trash2,
  Star,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// import { Layout } from "@/components/Layout";
import { usePlans } from "@/context/PlansContext";

const SavedPlans = () => {
  const {
    mealPlans,
    workoutPlans,
    activeMealPlan,
    activeWorkoutPlan,
    deleteMealPlan,
    deleteWorkoutPlan,
    setActiveMealPlan,
    setActiveWorkoutPlan,
  } = usePlans();
  const [expandedWorkoutId, setExpandedWorkoutId] = useState<string | null>(
    null
  );

  const toggleWorkout = (id: string) => {
    setExpandedWorkoutId(expandedWorkoutId === id ? null : id);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-8"
      >
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold mb-2 flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-primary" />
            Saved Plans
          </h1>
          <p className="text-muted-foreground">
            Manage your saved meal and workout plans.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <Card variant="glow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Utensils className="w-5 h-5 text-primary" />
                Meal Plans
              </CardTitle>
            </CardHeader>
            <CardContent>
              {mealPlans.length > 0 ? (
                <div className="space-y-4">
                  {mealPlans.map((plan) => (
                    <div
                      key={plan.id}
                      className="glass rounded-xl p-4 flex justify-between items-center"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{plan.name}</span>
                          {activeMealPlan?.id === plan.id && (
                            <Star className="w-4 h-4 text-primary fill-primary" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {plan.calories} kcal • {plan.dietType}
                        </p>
                      </div>
                      <div className="flex gap-2">
                       
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => deleteMealPlan(plan.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Utensils className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No saved meal plans</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card variant="glow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Dumbbell className="w-5 h-5 text-secondary" />
                Workout Plans
              </CardTitle>
            </CardHeader>
            <CardContent>
              {workoutPlans.length > 0 ? (
                <div className="space-y-4">
                  {workoutPlans.map((plan) => (
                    <div
                      key={plan.id}
                      className="glass rounded-xl overflow-hidden"
                    >
                      <div className="p-4 flex justify-between items-center">
                        <div
                          className="flex-1 cursor-pointer"
                          onClick={() => toggleWorkout(plan.id)}
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{plan.name}</span>
                            {activeWorkoutPlan?.id === plan.id && (
                              <Star className="w-4 h-4 text-secondary fill-secondary" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {plan.goal} • {plan.split}
                          </p>
                        </div>
                        <div className="flex gap-2 items-center">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toggleWorkout(plan.id)}
                          >
                            {expandedWorkoutId === plan.id ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setActiveWorkoutPlan(plan.id)}
                          >
                            Activate
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive"
                            onClick={() => deleteWorkoutPlan(plan.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <AnimatePresence>
                        {expandedWorkoutId === plan.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="bg-black/20 border-t border-white/5"
                          >
                            <div className="p-4 space-y-4">
                              {plan.days?.map((day: any, idx: number) => (
                                <div key={idx} className="space-y-2">
                                  <h4 className="text-sm font-semibold text-secondary flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                                    {day.day}: {day.name}
                                  </h4>
                                  <div className="grid gap-2 pl-4">
                                    {day.exercises.map((ex: any, i: number) => (
                                      <div
                                        key={i}
                                        className="text-sm text-muted-foreground flex justify-between items-start border-b border-white/5 pb-1 last:border-0"
                                      >
                                        <span>{ex.name}</span>
                                        <span className="text-xs opacity-70 ml-2 whitespace-nowrap">
                                          {ex.sets} x {ex.reps}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Dumbbell className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No saved workout plans</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </>
  );
};

export default SavedPlans;
