import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  subValue?: string;
  trend?: "up" | "down" | "neutral";
  color?: "primary" | "cyan" | "orange" | "purple";
}

const colorVariants = {
  primary: {
    icon: "from-lime-500 to-lime-600",
    glow: "shadow-[0_0_30px_hsl(82,85%,45%,0.3)]",
  },
  cyan: {
    icon: "from-cyan-500 to-cyan-600",
    glow: "shadow-[0_0_30px_hsl(192,95%,45%,0.3)]",
  },
  orange: {
    icon: "from-orange-500 to-orange-600",
    glow: "shadow-[0_0_30px_hsl(25,95%,53%,0.3)]",
  },
  purple: {
    icon: "from-purple-500 to-purple-600",
    glow: "shadow-[0_0_30px_hsl(270,95%,55%,0.3)]",
  },
};

export const StatCard = ({
  icon: Icon,
  label,
  value,
  subValue,
  color = "primary",
}: StatCardProps) => {
  const colorClasses = colorVariants[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      <Card variant="glow" className="overflow-hidden">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">{label}</p>
            <p className="text-3xl font-bold">{value}</p>
            {subValue && (
              <p className="text-sm text-muted-foreground mt-1">{subValue}</p>
            )}
          </div>
          <div
            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClasses.icon} ${colorClasses.glow} flex items-center justify-center`}
          >
            <Icon className="w-6 h-6 text-foreground" />
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
