
'use client'
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/StatCard";
import { Layout } from "@/components/Layout";
import { usePlans } from "@/context/PlansContext";
import Link from "next/link";

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
    <Layout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* Header */}
        <motion.div variants={itemVariants}>
          <h1 className="text-3xl lg:text-4xl font-bold mb-2">
            Welcome Back! 💪
          </h1>
          <p className="text-muted-foreground">
            Track your progress and stay on top of your fitness goals.
          </p>
        </motion.div>

        {/* Stats Grid */}
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
          {/* Active Meal Plan */}
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
                      <p className="font-semibold text-lg">{activeMealPlan.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {activeMealPlan.goal} • {activeMealPlan.dietType}
                      </p>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-1 glass rounded-lg p-3 text-center">
                        <p className="text-2xl font-bold text-primary">
                          {activeMealPlan.calories}
                        </p>
                        <p className="text-xs text-muted-foreground">Calories</p>
                      </div>
                      <div className="flex-1 glass rounded-lg p-3 text-center">
                        <p className="text-2xl font-bold text-secondary">
                          {activeMealPlan.meals.length}
                        </p>
                        <p className="text-xs text-muted-foreground">Meals/Day</p>
                      </div>
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

          {/* Active Workout Plan */}
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
                    <div>
                      <p className="font-semibold text-lg">
                        {activeWorkoutPlan.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {activeWorkoutPlan.goal} • {activeWorkoutPlan.split}
                      </p>
                    </div>
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

        {/* Quick Actions */}
        <motion.div variants={itemVariants}>
          <Card variant="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Link href="/meal-plans" className="block">
                  <Button
                    variant="glass"
                    className="w-full h-auto py-6 flex-col gap-2"
                  >
                    <Utensils className="w-6 h-6 text-primary" />
                    <span>Generate Meal Plan</span>
                  </Button>
                </Link>
                <Link href="/workouts" className="block">
                  <Button
                    variant="glass"
                    className="w-full h-auto py-6 flex-col gap-2"
                  >
                    <Dumbbell className="w-6 h-6 text-secondary" />
                    <span>Generate Workout</span>
                  </Button>
                </Link>
                <Link href="/progress" className="block">
                  <Button
                    variant="glass"
                    className="w-full h-auto py-6 flex-col gap-2"
                  >
                    <Calendar className="w-6 h-6 text-orange-500" />
                    <span>Log Workout</span>
                  </Button>
                </Link>
                <Link href="/compare" className="block">
                  <Button
                    variant="glass"
                    className="w-full h-auto py-6 flex-col gap-2"
                  >
                    <TrendingUp className="w-6 h-6 text-purple-500" />
                    <span>Compare Progress</span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </Layout>
  );
};

export default Dashboard;
