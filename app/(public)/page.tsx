"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Flame,
  ArrowRight,
  Utensils,
  Dumbbell,
  TrendingUp,
  Sparkles,
  PersonStanding,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const features = [
  {
    icon: Utensils,
    title: "Indian Meal Plans",
    description:
      "Personalized nutrition plans with authentic Indian cuisine that fits your goals and budget.",
    color: "from-lime-500 to-lime-600",
  },
  {
    icon: Dumbbell,
    title: "Custom Workouts",
    description:
      "AI-powered workout plans tailored to your equipment, experience, and preferred split.",
    color: "from-cyan-500 to-cyan-600",
  },
  {
    icon: TrendingUp,
    title: "Progress Tracking",
    description:
      "Track every rep and compare your performance week-over-week with detailed analytics.",
    color: "from-orange-500 to-orange-600",
  },
  {
    icon: Sparkles,
    title: "AI-Powered",
    description:
      "Powered by Gemini AI for intelligent, personalized recommendations.",
    color: "from-purple-500 to-purple-600",
  },
];

export default function HomePage() {
  const { user } = useAuth();
  const router = useRouter();

  // Redirect logged-in users to dashboard
  useEffect(() => {
    if (user) {
      router.replace("/dashboard");
    }
  }, [user, router]);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-hero-pattern" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />

      {/* Navbar */}
      <nav className="relative z-50 flex items-center justify-between p-6 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-lime-500 to-lime-600 flex items-center justify-center shadow-glow">
            <PersonStanding className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-gradient-primary">
            ProFormAi{" "}
          </span>
        </Link>

        <div className="flex items-center gap-4">
          {/* <Link href="/auth">
            <Button variant="ghost">Login</Button>
          </Link> */}
          <Link href="/auth">
            <Button variant="glow">
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-24 lg:pt-24 lg:pb-32">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight mb-6"
          >
            Transform Your Body with{" "}
            <span className="text-gradient-primary">Indian Nutrition</span> &{" "}
            <span className="text-gradient-secondary">Smart Workouts</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            Get personalized Indian meal plans and custom workout routines.
            Track your progress and achieve your fitness goals with AI-powered
            insights.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/login">
              <Button variant="glow" size="xl">
                Start Your Journey
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/services">
              <Button variant="outline" size="xl">
                Learn More
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
className="flex flex-wrap justify-center items-center gap-4 lg:gap-8 mt-16 lg:mt-24"
        >
          {[
            { value: "100+", label: "Indian Recipes" },
            { value: "50+", label: "Workout Plans" },
           
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <p className="text-3xl lg:text-4xl font-bold text-gradient-primary">
                {stat.value}
              </p>
              <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Features */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              whileHover={{ y: -8 }}
            >
              <Card variant="glow" className="h-full">
                <div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}
                >
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
