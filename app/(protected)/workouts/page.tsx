"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Dumbbell,
  Sparkles,
  Target,
  Clock,
  Layers,
  Plus,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Layout } from "@/components/Layout";
import { usePlans, WorkoutPlan } from "@/context/PlansContext";
import { toast } from "@/hooks/use-toast";

const exerciseDatabase = {
  chest: [
    { name: "Bench Press", sets: 4, reps: "8-10", rest: "90s" },
    { name: "Incline Dumbbell Press", sets: 3, reps: "10-12", rest: "60s" },
    { name: "Cable Flyes", sets: 3, reps: "12-15", rest: "60s" },
    { name: "Push-Ups", sets: 3, reps: "15-20", rest: "45s" },
  ],
  back: [
    { name: "Pull-Ups", sets: 4, reps: "8-10", rest: "90s" },
    { name: "Barbell Rows", sets: 4, reps: "8-10", rest: "90s" },
    { name: "Lat Pulldown", sets: 3, reps: "10-12", rest: "60s" },
    { name: "Seated Cable Rows", sets: 3, reps: "10-12", rest: "60s" },
  ],
  legs: [
    { name: "Squats", sets: 4, reps: "8-10", rest: "120s" },
    { name: "Romanian Deadlift", sets: 3, reps: "10-12", rest: "90s" },
    { name: "Leg Press", sets: 3, reps: "12-15", rest: "90s" },
    { name: "Leg Curls", sets: 3, reps: "12-15", rest: "60s" },
  ],
  shoulders: [
    { name: "Overhead Press", sets: 4, reps: "8-10", rest: "90s" },
    { name: "Lateral Raises", sets: 3, reps: "12-15", rest: "45s" },
    { name: "Face Pulls", sets: 3, reps: "15-20", rest: "45s" },
    { name: "Rear Delt Flyes", sets: 3, reps: "12-15", rest: "45s" },
  ],
  arms: [
    { name: "Barbell Curls", sets: 3, reps: "10-12", rest: "60s" },
    { name: "Tricep Dips", sets: 3, reps: "10-12", rest: "60s" },
    { name: "Hammer Curls", sets: 3, reps: "12-15", rest: "45s" },
    { name: "Tricep Pushdowns", sets: 3, reps: "12-15", rest: "45s" },
  ],
};

const splitTemplates = {
  "full-body": [
    { day: "Day 1", name: "Full Body A", muscles: ["chest", "back", "legs"] },
    { day: "Day 2", name: "Rest", muscles: [] },
    {
      day: "Day 3",
      name: "Full Body B",
      muscles: ["shoulders", "arms", "legs"],
    },
  ],
  "upper-lower": [
    {
      day: "Day 1",
      name: "Upper Body",
      muscles: ["chest", "back", "shoulders"],
    },
    { day: "Day 2", name: "Lower Body", muscles: ["legs"] },
    { day: "Day 3", name: "Upper Body", muscles: ["chest", "back", "arms"] },
    { day: "Day 4", name: "Lower Body", muscles: ["legs"] },
  ],
  "push-pull-legs": [
    { day: "Day 1", name: "Push", muscles: ["chest", "shoulders"] },
    { day: "Day 2", name: "Pull", muscles: ["back"] },
    { day: "Day 3", name: "Legs", muscles: ["legs"] },
    { day: "Day 4", name: "Push", muscles: ["chest", "shoulders"] },
    { day: "Day 5", name: "Pull", muscles: ["back", "arms"] },
    { day: "Day 6", name: "Legs", muscles: ["legs"] },
  ],
  "bro-split": [
    { day: "Day 1", name: "Chest", muscles: ["chest"] },
    { day: "Day 2", name: "Back", muscles: ["back"] },
    { day: "Day 3", name: "Shoulders", muscles: ["shoulders"] },
    { day: "Day 4", name: "Legs", muscles: ["legs"] },
    { day: "Day 5", name: "Arms", muscles: ["arms"] },
  ],
};

const Workouts = () => {
  const { addWorkoutPlan, setActiveWorkoutPlan } = usePlans();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<WorkoutPlan | null>(null);
  const [activeDay, setActiveDay] = useState("Day 1");

  const [formData, setFormData] = useState({
    goal: "muscle-gain",
    experience: "intermediate",
    equipment: "gym",
    daysPerWeek: "4",
    timePerSession: "60",
    split: "push-pull-legs",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const generateWorkoutPlan = () => {
    setIsGenerating(true);

    setTimeout(() => {
      const split =
        splitTemplates[formData.split as keyof typeof splitTemplates];
      const days = split.map((dayTemplate) => {
        const exercises = dayTemplate.muscles.flatMap((muscle) => {
          const muscleExercises =
            exerciseDatabase[muscle as keyof typeof exerciseDatabase];
          return muscleExercises.slice(0, 2);
        });

        return {
          day: dayTemplate.day,
          name: dayTemplate.name,
          exercises,
        };
      });

      const newPlan: WorkoutPlan = {
        id: Date.now().toString(),
        name: `${formData.split.replace("-", " ")} Plan`,
        createdAt: new Date().toISOString(),
        goal: formData.goal,
        split: formData.split,
        isActive: false,
        days,
      };

      setGeneratedPlan(newPlan);
      setActiveDay("Day 1");
      setIsGenerating(false);
    }, 2000);
  };

  const savePlan = () => {
    if (generatedPlan) {
      addWorkoutPlan(generatedPlan);
      setActiveWorkoutPlan(generatedPlan.id);
      toast({
        title: "Workout Plan Saved!",
        description: "Your workout plan has been saved and activated.",
      });
      setGeneratedPlan(null);
    }
  };

  const currentDayPlan = generatedPlan?.days.find((d) => d.day === activeDay);

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-8"
      >
        {/* Header */}
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold mb-2 flex items-center gap-3">
            <Dumbbell className="w-8 h-8 text-secondary" />
            Workout Generator
          </h1>
          <p className="text-muted-foreground">
            Create custom workout plans based on your goals and equipment.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form */}
          <Card variant="glow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-secondary" />
                Your Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Fitness Goal
                </Label>
                <Select
                  value={formData.goal}
                  onValueChange={(v: any) => handleChange("goal", v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="muscle-gain">Muscle Gain</SelectItem>
                    <SelectItem value="fat-loss">Fat Loss</SelectItem>
                    <SelectItem value="strength">Strength</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Experience Level</Label>
                <Select
                  value={formData.experience}
                  onValueChange={(v: any) => handleChange("experience", v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Equipment Access</Label>
                <Select
                  value={formData.equipment}
                  onValueChange={(v: any) => handleChange("equipment", v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gym">Full Gym</SelectItem>
                    <SelectItem value="home">Home Equipment</SelectItem>
                    <SelectItem value="bodyweight">Bodyweight Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Days/Week
                  </Label>
                  <Select
                    value={formData.daysPerWeek}
                    onValueChange={(v: any) => handleChange("daysPerWeek", v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 Days</SelectItem>
                      <SelectItem value="4">4 Days</SelectItem>
                      <SelectItem value="5">5 Days</SelectItem>
                      <SelectItem value="6">6 Days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Time/Session</Label>
                  <Select
                    value={formData.timePerSession}
                    onValueChange={(v: any) =>
                      handleChange("timePerSession", v)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="45">45 mins</SelectItem>
                      <SelectItem value="60">60 mins</SelectItem>
                      <SelectItem value="90">90 mins</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Layers className="w-4 h-4" />
                  Workout Split
                </Label>
                <Select
                  value={formData.split}
                  onValueChange={(v: any) => handleChange("split", v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-body">Full Body</SelectItem>
                    <SelectItem value="upper-lower">Upper / Lower</SelectItem>
                    <SelectItem value="push-pull-legs">
                      Push / Pull / Legs
                    </SelectItem>
                    <SelectItem value="bro-split">Bro Split</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                variant="cyan"
                size="lg"
                className="w-full"
                onClick={generateWorkoutPlan}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <div className="w-5 h-5 border-2 border-foreground/30 border-t-foreground rounded-full animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate Workout Plan
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Generated Plan */}
          <Card variant="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-secondary" />
                Generated Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              {generatedPlan ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold capitalize">
                        {generatedPlan.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {generatedPlan.goal} • {generatedPlan.split}
                      </p>
                    </div>
                    <Button variant="cyan" onClick={savePlan}>
                      <Plus className="w-4 h-4" />
                      Save Plan
                    </Button>
                  </div>

                  <Tabs value={activeDay} onValueChange={setActiveDay}>
                    <TabsList className="w-full flex-wrap h-auto">
                      {generatedPlan.days.map((day) => (
                        <TabsTrigger
                          key={day.day}
                          value={day.day}
                          className="
                                flex-1 min-w-fit
                                rounded-lg
                                px-4 py-2
                                text-sm font-medium
                                transition-all

                                text-muted-foreground
                                hover:text-foreground

                                data-[state=active]:bg-lime-500
                                data-[state=active]:text-black
                                data-[state=active]:shadow-sm
                              "
                        >
                          {day.day}
                        </TabsTrigger>
                      ))}
                    </TabsList>

                    {generatedPlan.days.map((day) => (
                      <TabsContent key={day.day} value={day.day}>
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="space-y-4"
                        >
                          <div className="glass rounded-xl p-4">
                            <h4 className="font-bold text-lg mb-4 text-secondary">
                              {day.name}
                            </h4>
                            {day.exercises.length > 0 ? (
                              <div className="space-y-3">
                                {day.exercises.map((exercise, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-center justify-between py-2 border-b border-border/50 last:border-0"
                                  >
                                    <div className="flex items-center gap-3">
                                      <span className="w-8 h-8 rounded-lg bg-secondary/20 flex items-center justify-center text-sm font-bold text-secondary">
                                        {idx + 1}
                                      </span>
                                      <span className="font-medium">
                                        {exercise.name}
                                      </span>
                                    </div>
                                    <div className="flex gap-4 text-sm text-muted-foreground">
                                      <span>{exercise.sets} sets</span>
                                      <span>{exercise.reps} reps</span>
                                      <span>{exercise.rest}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-muted-foreground text-center py-4">
                                Rest Day - Recovery & Light Stretching
                              </p>
                            )}
                          </div>
                        </motion.div>
                      </TabsContent>
                    ))}
                  </Tabs>
                </motion.div>
              ) : (
                <div className="text-center py-16">
                  <Dumbbell className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Set your preferences and generate a custom workout plan.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </>
  );
};

export default Workouts;
