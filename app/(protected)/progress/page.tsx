"use client";

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
    const updated = [...exercises];
    updated[exerciseIndex].sets.push({ reps: 0, weight: 0 });
    setExercises(updated);
  };

  const removeSet = (exerciseIndex: number, setIndex: number) => {
    const updated = [...exercises];
    updated[exerciseIndex].sets.splice(setIndex, 1);
    setExercises(updated);
  };

  const updateExercise = (index: number, value: string) => {
    const updated = [...exercises];
    updated[index].name = value;
    setExercises(updated);
  };

  const updateSet = (
    exerciseIndex: number,
    setIndex: number,
    field: "reps" | "weight",
    value: number
  ) => {
    const updated = [...exercises];
    updated[exerciseIndex].sets[setIndex][field] = value;
    setExercises(updated);
  };

  const getWeekNumber = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const diff = now.getTime() - start.getTime();
    return Math.ceil(diff / 604800000);
  };

  const saveWorkout = () => {
    const validExercises = exercises.filter(
      (e) => e.name && e.sets.some((s) => s.reps > 0)
    );

    if (!validExercises.length) {
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

  const groupedLogs = workoutLogs.reduce<Record<string, WorkoutLog[]>>(
    (acc, log) => {
      const key = `Week ${log.week}`;
      acc[key] = acc[key] || [];
      acc[key].push(log);
      return acc;
    },
    {}
  );

  return (
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
              {exercises.map((exercise, exIdx) => (
                <div key={exIdx} className="glass rounded-xl p-4 space-y-4">
                  <Input
                    placeholder="Exercise name"
                    value={exercise.name}
                    onChange={(e) =>
                      updateExercise(exIdx, e.target.value)
                    }
                  />

                  {exercise.sets.map((set, setIdx) => (
                    <div key={setIdx} className="flex gap-2 items-center">
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
                            Number(e.target.value) || 0
                          )
                        }
                      />
                      <Input
                        type="number"
                        placeholder="Weight"
                        className="w-28"
                        value={set.weight || ""}
                        onChange={(e) =>
                          updateSet(
                            exIdx,
                            setIdx,
                            "weight",
                            Number(e.target.value) || 0
                          )
                        }
                      />
                      {exercise.sets.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeSet(exIdx, setIdx)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
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
              ))}

              <Button variant="outline" onClick={addExercise}>
                <Plus className="w-4 h-4 mr-2" />
                Add Exercise
              </Button>
            </div>

            <Button variant="glow" size="lg" className="w-full" onClick={saveWorkout}>
              <Save className="w-5 h-5 mr-2" />
              Save Workout
            </Button>
          </CardContent>
        </Card>

        {/* History */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-orange-500" />
              Workout History
            </CardTitle>
          </CardHeader>

          <CardContent>
            {Object.keys(groupedLogs).length ? (
              Object.entries(groupedLogs).map(([week, logs]) => (
                <div key={week} className="mb-6">
                  <h4 className="font-bold mb-3">{week}</h4>
                  {logs.map((log) => (
                    <div key={log.id} className="glass rounded-lg p-4 mb-2">
                      <div className="flex justify-between">
                        <span className="font-semibold">{log.dayName}</span>
                        <span className="text-sm text-muted-foreground">
                          {new Date(log.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ))
            ) : (
              <div className="text-center py-16 text-muted-foreground">
                No workouts logged yet.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default Progress;
