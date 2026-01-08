'use client'
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Utensils,
  Sparkles,
  User,
  Target,
  Wallet,
  Clock,
  Leaf,
  Plus,
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
// import { Layout } from "@/components/Layout";
import { usePlans, MealPlan } from "@/context/PlansContext";
import { toast } from "@/hooks/use-toast";


const MealPlans = () => {
  const { addMealPlan, setActiveMealPlan } = usePlans();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<MealPlan | null>(null);

  const [formData, setFormData] = useState({
    age: "",
    gender: "male",
    height: "",
    weight: "",
    goal: "maintenance",
    dietType: "veg",
    mealsPerDay: "3",
    budget: "medium",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const calculateCalories = () => {
    const weight = parseFloat(formData.weight) || 70;
    const height = parseFloat(formData.height) || 170;
    const age = parseFloat(formData.age) || 25;
    const isMale = formData.gender === "male";

    // BMR calculation (Mifflin-St Jeor)
    let bmr = isMale
      ? 10 * weight + 6.25 * height - 5 * age + 5
      : 10 * weight + 6.25 * height - 5 * age - 161;

    // Activity multiplier (assume moderate)
    let tdee = bmr * 1.55;

    // Adjust for goal
    if (formData.goal === "fat-loss") tdee -= 500;
    if (formData.goal === "muscle-gain") tdee += 300;

    return Math.round(tdee);
  };
const generateMealPlan = async () => {
  setIsGenerating(true);

  try {
    const res = await fetch("/api/meal-plan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.error);

    const newPlan: MealPlan = {
      id: Date.now().toString(),
      name: `${formData.goal.replace("-", " ")} Plan`,
      createdAt: new Date().toISOString(),
      goal: formData.goal,
      dietType: formData.dietType,
      calories: data.calories,
      meals: data.meals,
    };

    setGeneratedPlan(newPlan);
  } catch (error) {
    toast({
      title: "Error",
      description: "Failed to generate meal plan",
      variant: "destructive",
    });
  } finally {
    setIsGenerating(false);
  }
};



  const savePlan = () => {
    if (generatedPlan) {
      addMealPlan(generatedPlan);
      setActiveMealPlan(generatedPlan.id);
      toast({
        title: "Meal Plan Saved!",
        description: "Your meal plan has been saved and activated.",
      });
      setGeneratedPlan(null);
    }
  };

  return (
    // <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-8"
      >
        {/* Header */}
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold mb-2 flex items-center gap-3">
            <Utensils className="w-8 h-8 text-primary" />
            Indian Meal Planner
          </h1>
          <p className="text-muted-foreground">
            Generate personalized meal plans with authentic Indian cuisine.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form */}
          <Card variant="glow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Your Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="25"
                    value={formData.age}
                    onChange={(e) => handleChange("age", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(v:any) => handleChange("gender", v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    placeholder="170"
                    value={formData.height}
                    onChange={(e) => handleChange("height", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    placeholder="70"
                    value={formData.weight}
                    onChange={(e) => handleChange("weight", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Goal
                </Label>
                <Select
                  value={formData.goal}
                  onValueChange={(v:any) => handleChange("goal", v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fat-loss">Fat Loss</SelectItem>
                    <SelectItem value="muscle-gain">Muscle Gain</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Leaf className="w-4 h-4" />
                  Diet Type
                </Label>
                <Select
                  value={formData.dietType}
                  onValueChange={(v:any) => handleChange("dietType", v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="veg">Vegetarian</SelectItem>
                    <SelectItem value="egg">Eggetarian</SelectItem>
                    <SelectItem value="nonveg">Non-Vegetarian</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Meals/Day
                  </Label>
                  <Select
                    value={formData.mealsPerDay}
                    onValueChange={(v:any) => handleChange("mealsPerDay", v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 Meals</SelectItem>
                      <SelectItem value="4">4 Meals</SelectItem>
                      <SelectItem value="5">5 Meals</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Wallet className="w-4 h-4" />
                    Budget
                  </Label>
                  <Select
                    value={formData.budget}
                    onValueChange={(v:any) => handleChange("budget", v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                variant="glow"
                size="lg"
                className="w-full"
                onClick={generateMealPlan}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate Meal Plan
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Generated Plan */}
          <Card variant="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
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
                        {generatedPlan.dietType} • {generatedPlan.calories} kcal/day
                      </p>
                    </div>
                    <Button variant="glow" onClick={savePlan}>
                      <Plus className="w-4 h-4" />
                      Save Plan
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {generatedPlan.meals.map((meal, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="glass rounded-xl p-4"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-semibold">{meal.name}</h4>
                          <span className="text-sm text-muted-foreground">
                            {meal.time}
                          </span>
                        </div>
                        {meal.foods.map((food, fIdx) => (
                          <div
                            key={fIdx}
                            className="flex justify-between items-center text-sm"
                          >
                            <span className="text-foreground">{food.name}</span>
                            <div className="flex gap-3 text-muted-foreground">
                              <span>{food.calories} kcal</span>
                              <span>P: {food.protein}g</span>
                              <span>C: {food.carbs}g</span>
                              <span>F: {food.fats}g</span>
                            </div>
                          </div>
                        ))}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <div className="text-center py-16">
                  <Utensils className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Fill in your details and generate a personalized Indian meal
                    plan.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </motion.div>
    // </Layout>
  );
};

export default MealPlans;
