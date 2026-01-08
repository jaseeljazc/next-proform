import mongoose, { Schema, model, models } from "mongoose";

const FoodSchema = new Schema({
  name: { type: String, required: true },
  calories: { type: Number, required: true },
  protein: { type: Number, required: true },
  carbs: { type: Number, required: true },
  fats: { type: Number, required: true },
});

const MealSchema = new Schema({
  name: { type: String, required: true },
  time: { type: String, required: true },
  foods: [FoodSchema],
});

const MealPlanSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    goal: {
      type: String,
      required: true,
    },
    dietType: {
      type: String,
      required: true,
    },
    calories: {
      type: Number,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    meals: [MealSchema],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const MealPlan = models.MealPlan || model("MealPlan", MealPlanSchema);

export default MealPlan;
