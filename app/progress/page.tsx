'use client'

import { useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Calendar,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Layout } from "@/components/Layout";
import { usePlans, WorkoutLog } from "@/context/PlansContext";
import { toast } from "@/hooks/use-toast";

const workoutDays = [
  "Chest",
  "Back",
  "Legs",
  "Shoulders",
  "Arms",
  "Push",
  "Pull",
  "Full Body",
];

const Progress = () => {
  const { workoutLogs, addWorkoutLog } = usePlans();
  const [selectedDay, setSelectedDay] = useState("Chest");
  const [exercises, setExercises] = useState([
    { name: "", sets: [{ reps: 0, weight: 0 }] },
  ]);

  const addExercise = () => {
    setExercises([...exercises, { name: "", sets: [{ reps: 0, weight: 0 }] }]);
  };

  const addSet = (exerciseIndex: number) => {
    const newExercises = [...exercises];
    newExercises[exerciseIndex].sets.push({ reps: 0, weight: 0 });
    setExercises(newExercises);
  };

  const removeSet = (exerciseIndex: number, setIndex: number) => {
    const newExercises = [...exercises];
    newExercises[exerciseIndex].sets.splice(setIndex, 1);
    setExercises(newExercises);
  };

  const updateExercise = (index: number, field: string, value: string) => {
    const newExercises = [...exercises];
    newExercises[index] = { ...newExercises[index], [field]: value };
    setExercises(newExercises);
  };

  const updateSet = (
    exerciseIndex: number,
    setIndex: number,
    field: "reps" | "weight",
    value: number
  ) => {
    const newExercises = [...exercises];
    newExercises[exerciseIndex].sets[setIndex][field] = value;
    setExercises(newExercises);
  };

  const getWeekNumber = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const diff = now.getTime() - start.getTime();
    const oneWeek = 604800000;
    return Math.ceil(diff / oneWeek);
  };

  const saveWorkout = () => {
    const validExercises = exercises.filter(
      (e) => e.name && e.sets.some((s) => s.reps > 0)
    );

    if (validExercises.length === 0) {
      toast({
        title: "No exercises logged",
        description: "Please add at least one exercise with reps.",
        variant: "destructive",
      });
      return;
    }

    const log: WorkoutLog = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      week: getWeekNumber(),
      dayName: selectedDay,
      exercises: validExercises,
    };

    addWorkoutLog(log);
    toast({
      title: "Workout Saved!",
      description: `Your ${selectedDay} workout has been logged.`,
    });
    setExercises([{ name: "", sets: [{ reps: 0, weight: 0 }] }]);
  };

  const groupedLogs = workoutLogs.reduce((acc, log) => {
    const weekKey = `Week ${log.week}`;
    if (!acc[weekKey]) acc[weekKey] = [];
    acc[weekKey].push(log);
    return acc;
  }, {} as Record<string, WorkoutLog[]>);

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-8"
      >
        {/* Header */}
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold mb-2 flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-orange-500" />
            Progress Tracking
          </h1>
          <p className="text-muted-foreground">
            Log your workouts and track your progress week by week.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Log Workout */}
          <Card variant="glow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-orange-500" />
                Log Today's Workout
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Workout Day</Label>
                <Select value={selectedDay} onValueChange={setSelectedDay}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {workoutDays.map((day) => (
                      <SelectItem key={day} value={day}>
                        {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <Label>Exercises</Label>
                {exercises.map((exercise, exIdx) => (
                  <motion.div
                    key={exIdx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass rounded-xl p-4 space-y-4"
                  >
                    <Input
                      placeholder="Exercise name (e.g., Bench Press)"
                      value={exercise.name}
                      onChange={(e) =>
                        updateExercise(exIdx, "name", e.target.value)
                      }
                    />
                    <div className="space-y-2">
                      {exercise.sets.map((set, setIdx) => (
                        <div
                          key={setIdx}
                          className="flex items-center gap-2"
                        >
                          <span className="w-8 h-8 rounded bg-muted flex items-center justify-center text-sm font-medium">
                            {setIdx + 1}
                          </span>
                          <Input
                            type="number"
                            placeholder="Reps"
                            className="w-24"
                            value={set.reps || ""}
                            onChange={(e) =>
                              updateSet(
                                exIdx,
                                setIdx,
                                "reps",
                                parseInt(e.target.value) || 0
                              )
                            }
                          />
                          <span className="text-muted-foreground">×</span>
                          <Input
                            type="number"
                            placeholder="Weight (kg)"
                            className="w-28"
                            value={set.weight || ""}
                            onChange={(e) =>
                              updateSet(
                                exIdx,
                                setIdx,
                                "weight",
                                parseInt(e.target.value) || 0
                              )
                            }
                          />
                          <span className="text-sm text-muted-foreground">kg</span>
                          {exercise.sets.length > 1 && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive"
                              onClick={() => removeSet(exIdx, setIdx)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => addSet(exIdx)}
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Set
                      </Button>
                    </div>
                  </motion.div>
                ))}
                <Button variant="outline" onClick={addExercise}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Exercise
                </Button>
              </div>

              <Button
                variant="glow"
                size="lg"
                className="w-full"
                onClick={saveWorkout}
              >
                <Save className="w-5 h-5" />
                Save Workout
              </Button>
            </CardContent>
          </Card>

          {/* Workout History */}
          <Card variant="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-orange-500" />
                Workout History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {Object.keys(groupedLogs).length > 0 ? (
                <div className="space-y-6">
                  {Object.entries(groupedLogs)
                    .sort((a, b) => b[0].localeCompare(a[0]))
                    .map(([week, logs]) => (
                      <div key={week}>
                        <h4 className="font-bold text-lg mb-3 text-primary">
                          {week}
                        </h4>
                        <div className="space-y-3">
                          {logs.map((log) => (
                            <motion.div
                              key={log.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="glass rounded-lg p-4"
                            >
                              <div className="flex justify-between items-center mb-2">
                                <span className="font-semibold">{log.dayName}</span>
                                <span className="text-sm text-muted-foreground">
                                  {new Date(log.date).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {log.exercises.length} exercises •{" "}
                                {log.exercises.reduce(
                                  (acc, ex) => acc + ex.sets.length,
                                  0
                                )}{" "}
                                total sets
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <Calendar className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    No workouts logged yet. Start tracking your progress!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </Layout>
  );
};

export default Progress;
