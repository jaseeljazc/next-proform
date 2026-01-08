import mongoose, { Schema, model, models } from "mongoose";

const SetSchema = new Schema({
  reps: { type: Number, required: true },
  weight: { type: Number, required: true },
});

const ExerciseSchema = new Schema({
  name: { type: String, required: true },
  sets: [SetSchema],
});

const WorkoutLogSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    date: { type: Date, required: true },
    week: { type: Number, required: true },
    dayName: { type: String, required: true },
    exercises: [ExerciseSchema],
  },
  { timestamps: true }
);

const WorkoutLog = models.WorkoutLog || model("WorkoutLog", WorkoutLogSchema);

export default WorkoutLog;
