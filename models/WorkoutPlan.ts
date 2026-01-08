import mongoose, { Schema, model, models } from "mongoose";

const ExerciseSchema = new Schema({
  name: { type: String, required: true },
  sets: { type: Number, required: true },
  reps: { type: String, required: true },
  rest: { type: String, required: true },
});

const DaySchema = new Schema({
  day: { type: String, required: true },
  name: { type: String, required: true },
  exercises: [ExerciseSchema],
});

const WorkoutPlanSchema = new Schema(
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
    split: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    days: [DaySchema],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const WorkoutPlan =
  models.WorkoutPlan || model("WorkoutPlan", WorkoutPlanSchema);

export default WorkoutPlan;
