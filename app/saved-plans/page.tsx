'use client'

import { motion } from "framer-motion";
import { BookOpen, Utensils, Dumbbell, Trash2, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/Layout";
import { usePlans } from "@/context/PlansContext";

const SavedPlans = () => {
  const { mealPlans, workoutPlans, activeMealPlan, activeWorkoutPlan, deleteMealPlan, deleteWorkoutPlan, setActiveMealPlan, setActiveWorkoutPlan } = usePlans();

  return (
    <Layout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold mb-2 flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-primary" />
            Saved Plans
          </h1>
          <p className="text-muted-foreground">Manage your saved meal and workout plans.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <Card variant="glow">
            <CardHeader><CardTitle className="flex items-center gap-2"><Utensils className="w-5 h-5 text-primary" />Meal Plans</CardTitle></CardHeader>
            <CardContent>
              {mealPlans.length > 0 ? (
                <div className="space-y-4">
                  {mealPlans.map((plan) => (
                    <div key={plan.id} className="glass rounded-xl p-4 flex justify-between items-center">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{plan.name}</span>
                          {activeMealPlan?.id === plan.id && <Star className="w-4 h-4 text-primary fill-primary" />}
                        </div>
                        <p className="text-sm text-muted-foreground">{plan.calories} kcal • {plan.dietType}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setActiveMealPlan(plan.id)}>Activate</Button>
                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => deleteMealPlan(plan.id)}><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground"><Utensils className="w-12 h-12 mx-auto mb-3 opacity-50" /><p>No saved meal plans</p></div>
              )}
            </CardContent>
          </Card>

          <Card variant="glow">
            <CardHeader><CardTitle className="flex items-center gap-2"><Dumbbell className="w-5 h-5 text-secondary" />Workout Plans</CardTitle></CardHeader>
            <CardContent>
              {workoutPlans.length > 0 ? (
                <div className="space-y-4">
                  {workoutPlans.map((plan) => (
                    <div key={plan.id} className="glass rounded-xl p-4 flex justify-between items-center">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{plan.name}</span>
                          {activeWorkoutPlan?.id === plan.id && <Star className="w-4 h-4 text-secondary fill-secondary" />}
                        </div>
                        <p className="text-sm text-muted-foreground">{plan.goal} • {plan.split}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setActiveWorkoutPlan(plan.id)}>Activate</Button>
                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => deleteWorkoutPlan(plan.id)}><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground"><Dumbbell className="w-12 h-12 mx-auto mb-3 opacity-50" /><p>No saved workout plans</p></div>
              )}
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </Layout>
  );
};

export default SavedPlans;
