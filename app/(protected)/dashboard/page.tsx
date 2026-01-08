"use client";

import { motion } from "framer-motion";
import {
  Flame,
  Target,
  TrendingUp,
  Calendar,
  Trophy,
  Utensils,
  Dumbbell,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/StatCard";
import { usePlans } from "@/context/PlansContext";

const Dashboard = () => {
  const { activeMealPlan, activeWorkoutPlan, workoutLogs } = usePlans();

  const totalWorkouts = workoutLogs.length;
  const thisWeekWorkouts = workoutLogs.filter((log) => {
    const logDate = new Date(log.date);
    const now = new Date();
    const weekAgo = new Date(now.setDate(now.getDate() - 7));
    return logDate >= weekAgo;
  }).length;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl lg:text-4xl font-bold mb-2">
          Welcome Back!
        </h1>
        <p className="text-muted-foreground">
          Track your progress and stay on top of your fitness goals.
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Flame}
          label="Calories Today"
          value={activeMealPlan?.calories || "—"}
          subValue="kcal target"
          color="primary"
        />
        <StatCard
          icon={Dumbbell}
          label="Workouts This Week"
          value={thisWeekWorkouts}
          subValue="sessions completed"
          color="cyan"
        />
        <StatCard
          icon={Trophy}
          label="Total Workouts"
          value={totalWorkouts}
          subValue="all time"
          color="orange"
        />
        <StatCard
          icon={Target}
          label="Active Streak"
          value="0"
          subValue="days"
          color="purple"
        />
      </div>

      {/* Active Plans */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Meal Plan */}
        <motion.div variants={itemVariants}>
          <Card variant="glow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="flex items-center gap-2">
                <Utensils className="w-5 h-5 text-primary" />
                Active Meal Plan
              </CardTitle>
              <Link href="/meal-plans">
                <Button variant="ghost" size="sm">
                  View All
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {activeMealPlan ? (
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold text-lg">
                      {activeMealPlan.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {activeMealPlan.goal} • {activeMealPlan.dietType}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Utensils className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground mb-4">
                    No active meal plan
                  </p>
                  <Link href="/meal-plans">
                    <Button variant="glow" size="sm">
                      Create Meal Plan
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Workout Plan */}
        <motion.div variants={itemVariants}>
          <Card variant="glow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="flex items-center gap-2">
                <Dumbbell className="w-5 h-5 text-secondary" />
                Active Workout Plan
              </CardTitle>
              <Link href="/workouts">
                <Button variant="ghost" size="sm">
                  View All
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {activeWorkoutPlan ? (
                <div className="space-y-4">
                  <p className="font-semibold text-lg">
                    {activeWorkoutPlan.name}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {activeWorkoutPlan.days.map((day, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-lg glass text-sm font-medium"
                      >
                        {day.name}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Dumbbell className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground mb-4">
                    No active workout plan
                  </p>
                  <Link href="/workouts">
                    <Button variant="cyan" size="sm">
                      Create Workout Plan
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
