// import { motion } from "framer-motion";
// import { GitCompare, TrendingUp } from "lucide-react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Layout } from "@/components/Layout";
// import { usePlans } from "@/context/PlansContext";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { useState } from "react";
// import { Label } from "@/components/ui/label";
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// const Compare = () => {
//   const { workoutLogs } = usePlans();
//   const [workoutType, setWorkoutType] = useState("Chest");
//   const [week1, setWeek1] = useState("");
//   const [week2, setWeek2] = useState("");

//   const weeks = [...new Set(workoutLogs.map((l) => l.week))].sort((a, b) => a - b);

//   const getWeekData = (week: number, dayName: string) => {
//     return workoutLogs.find((l) => l.week === week && l.dayName === dayName);
//   };

//   const week1Data = week1 ? getWeekData(parseInt(week1), workoutType) : null;
//   const week2Data = week2 ? getWeekData(parseInt(week2), workoutType) : null;

//   const chartData = week1Data?.exercises.map((ex, idx) => ({
//     name: ex.name.substring(0, 10),
//     week1Volume: ex.sets.reduce((acc, s) => acc + s.reps * s.weight, 0),
//     week2Volume: week2Data?.exercises[idx]?.sets.reduce((acc, s) => acc + s.reps * s.weight, 0) || 0,
//   })) || [];

//   return (
//     <Layout>
//       <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
//         <div>
//           <h1 className="text-3xl lg:text-4xl font-bold mb-2 flex items-center gap-3">
//             <GitCompare className="w-8 h-8 text-purple-500" />
//             Compare Progress
//           </h1>
//           <p className="text-muted-foreground">Compare your workouts across different weeks.</p>
//         </div>

//         <Card variant="glow">
//           <CardHeader>
//             <CardTitle>Select Comparison</CardTitle>
//           </CardHeader>
//           <CardContent className="grid md:grid-cols-3 gap-4">
//             <div className="space-y-2">
//               <Label>Workout Type</Label>
//               <Select value={workoutType} onValueChange={setWorkoutType}>
//                 <SelectTrigger><SelectValue /></SelectTrigger>
//                 <SelectContent>
//                   {["Chest", "Back", "Legs", "Shoulders", "Arms", "Push", "Pull"].map((d) => (
//                     <SelectItem key={d} value={d}>{d}</SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="space-y-2">
//               <Label>Week A</Label>
//               <Select value={week1} onValueChange={setWeek1}>
//                 <SelectTrigger><SelectValue placeholder="Select week" /></SelectTrigger>
//                 <SelectContent>
//                   {weeks.map((w) => <SelectItem key={w} value={w.toString()}>Week {w}</SelectItem>)}
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="space-y-2">
//               <Label>Week B</Label>
//               <Select value={week2} onValueChange={setWeek2}>
//                 <SelectTrigger><SelectValue placeholder="Select week" /></SelectTrigger>
//                 <SelectContent>
//                   {weeks.map((w) => <SelectItem key={w} value={w.toString()}>Week {w}</SelectItem>)}
//                 </SelectContent>
//               </Select>
//             </div>
//           </CardContent>
//         </Card>

//         <Card variant="glass">
//           <CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="w-5 h-5" />Volume Comparison</CardTitle></CardHeader>
//           <CardContent>
//             {chartData.length > 0 ? (
//               <ResponsiveContainer width="100%" height={300}>
//                 <BarChart data={chartData}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
//                   <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
//                   <YAxis stroke="hsl(var(--muted-foreground))" />
//                   <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
//                   <Bar dataKey="week1Volume" name={`Week ${week1}`} fill="hsl(82, 85%, 45%)" radius={[4, 4, 0, 0]} />
//                   <Bar dataKey="week2Volume" name={`Week ${week2}`} fill="hsl(192, 95%, 45%)" radius={[4, 4, 0, 0]} />
//                 </BarChart>
//               </ResponsiveContainer>
//             ) : (
//               <div className="text-center py-16 text-muted-foreground">
//                 <GitCompare className="w-16 h-16 mx-auto mb-4 opacity-50" />
//                 <p>Select weeks to compare your progress.</p>
//               </div>
//             )}
//           </CardContent>
//         </Card>
//       </motion.div>
//     </Layout>
//   );
// };

// export default Compare;
// app/(protected)/compare.tsx/page.tsx

export default function ComparePage() {
  return null;
}
