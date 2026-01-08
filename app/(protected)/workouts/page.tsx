"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Dumbbell, Sparkles, Target, Plus, PlayCircle } from "lucide-react";
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
import { usePlans } from "@/context/PlansContext";
import { toast } from "@/hooks/use-toast";

/* ---------------- COMPONENT ---------------- */

const Workouts = () => {
  const { addWorkoutPlan, setActiveWorkoutPlan } = usePlans();

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<any | null>(null);
  const [activeDay, setActiveDay] = useState("");

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

  /* ---------------- AI GENERATION ---------------- */

  const generateWorkoutPlan = async () => {
    try {
      setIsGenerating(true);
      setGeneratedPlan(null);

      const res = await fetch("/api/workouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed");

      const data = await res.json();

      if (!data.plan || !data.plan.days) {
        throw new Error("Invalid plan format");
      }

      setGeneratedPlan(data.plan);
      setActiveDay(data.plan.days[0]?.day || "");
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to generate workout plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  /* ---------------- SAVE PLAN ---------------- */

  const savePlan = () => {
    if (!generatedPlan) return;

    const plan = {
      id: Date.now().toString(),
      name: generatedPlan.name || "AI Workout Plan",
      goal: generatedPlan.goal || formData.goal,
      split: generatedPlan.split || formData.split,
      createdAt: new Date().toISOString(),
      isActive: false,
      days: generatedPlan.days,
    };

    addWorkoutPlan(plan as any);
    setActiveWorkoutPlan(plan.id, true);

    toast({
      title: "Workout Plan Saved!",
      description: "Your workout plan has been saved and activated.",
    });

    setGeneratedPlan(null);
  };

  /* ---------------- UI ---------------- */

  return (
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
        {/* ---------------- FORM ---------------- */}
        <Card variant="glow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-secondary" />
              Your Preferences
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Fitness Goal</Label>
              <Select
                value={formData.goal}
                onValueChange={(v) => handleChange("goal", v)}
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
                onValueChange={(v) => handleChange("experience", v)}
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
                onValueChange={(v) => handleChange("equipment", v)}
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
                <Label>Days / Week</Label>
                <Select
                  value={formData.daysPerWeek}
                  onValueChange={(v) => handleChange("daysPerWeek", v)}
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
                <Label>Time / Session</Label>
                <Select
                  value={formData.timePerSession}
                  onValueChange={(v) => handleChange("timePerSession", v)}
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
              <Label>Workout Split</Label>
              <Select
                value={formData.split}
                onValueChange={(v) => handleChange("split", v)}
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

        {/* ---------------- GENERATED PLAN ---------------- */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-secondary" />
              Generated Plan
            </CardTitle>
          </CardHeader>

          <CardContent>
            {generatedPlan ? (
              <>
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-primary">
                    {generatedPlan.name}
                  </h3>
                  <p className="text-sm text-muted-foreground capitalize">
                    {generatedPlan.goal.replace("-", " ")} •{" "}
                    {generatedPlan.split.replace("-", " ")}
                  </p>
                </div>

                {/* Tabs Header */}
                <Tabs
                  value={activeDay}
                  onValueChange={setActiveDay}
                  className="w-full"
                >
                  <TabsList className="w-full flex-wrap h-auto p-1 bg-muted/20">
                    {generatedPlan.days.map((day: any) => (
                      <TabsTrigger
                        key={day.day}
                        value={day.day}
                        className="flex-1 min-w-[80px]"
                      >
                        {day.day}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {/* Active Section Only */}
                  {generatedPlan.days.map((day: any) => (
                    <TabsContent
                      key={day.day}
                      value={day.day}
                      className="mt-4 space-y-4"
                    >
                      <div className="glass rounded-xl p-5 border-l-4 border-secondary">
                        <h4 className="font-bold text-lg text-foreground mb-4 flex items-center gap-2">
                          <Dumbbell className="w-5 h-5 text-secondary" />
                          {day.name}
                        </h4>

                        <div className="space-y-3">
                          {day.exercises.map((ex: any, i: number) => (
                            <div
                              key={i}
                              className="flex items-start gap-3 p-3 rounded-lg bg-background/40 hover:bg-background/60 transition-colors"
                            >
                              <div className="min-w-[24px] h-6 flex items-center justify-center rounded-full bg-secondary/20 text-secondary text-xs font-bold mt-0.5">
                                {i + 1}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <p className="font-semibold text-foreground">
                                    {ex.name}
                                  </p>
                                  {ex.videoUrl && (
                                    <a
                                      href={ex.videoUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-muted-foreground hover:text-red-500 transition-colors"
                                      title="Watch Tutorial"
                                    >
                                      <PlayCircle className="w-4 h-4" />
                                    </a>
                                  )}
                                </div>
                                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                                  <span className="bg-background/50 px-2 py-0.5 rounded">
                                    Sets: {ex.sets}
                                  </span>
                                  <span className="bg-background/50 px-2 py-0.5 rounded">
                                    Reps: {ex.reps}
                                  </span>
                                  <span className="bg-background/50 px-2 py-0.5 rounded">
                                    Rest: {ex.rest}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>

                <Button
                  variant="cyan"
                  className="w-full mt-6"
                  onClick={savePlan}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Save Plan To Dashboard
                </Button>
              </>
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
  );
};

export default Workouts;
