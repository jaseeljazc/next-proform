"use client";

import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Utensils,
  Dumbbell,
  TrendingUp,
  BookOpen,
  LogOut,
  Flame,
  BotMessageSquare,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

const desktopNavItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Utensils, label: "Meals", path: "/meal-plans" },
  { icon: Dumbbell, label: "Workouts", path: "/workouts" },
  { icon: TrendingUp, label: "Progress", path: "/progress" },
  { icon: BookOpen, label: "Saved", path: "/saved-plans" },
  { icon: BotMessageSquare, label: "Chat Bot", path: "/chat-bot" },
];

const mobileNavItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Utensils, label: "Meals", path: "/meal-plans" },
  { icon: Dumbbell, label: "Workouts", path: "/workouts" },
  { icon: TrendingUp, label: "Progress", path: "/progress" },
  { icon: BookOpen, label: "Saved", path: "/saved-plans" },
];


const Sidebar = () => {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const isActiveRoute = (path: string) =>
    pathname === path || pathname.startsWith(path + "/");

  return (
    <>
      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside className="hidden lg:flex w-64 flex-col glass-card border-r border-border/50 fixed h-screen z-40">
        {/* Logo */}
        <div className="p-6 border-b border-border/50">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-lime-500 to-lime-600 flex items-center justify-center shadow-glow">
              <Flame className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-linear-primary">
              ProformAi
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {desktopNavItems.map((item) => {
            const isActive = isActiveRoute(item.path);

            return (
              <Link key={item.path} href={item.path}>
                
                <motion.div
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.97 }}
                  className={cn(
                    "relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                    isActive
                      ? "bg-lime-500 text-black shadow-glow"
                      : "hover:bg-muted"
                  )}
                >
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-full bg-lime-400" />
                  )}

                  <item.icon
                    className={cn(
                      "w-5 h-5",
                      isActive
                        ? "text-primary-foreground"
                        : "text-muted-foreground"
                    )}
                  />
                  <span className="font-medium">{item.label}</span>
                </motion.div>
              </Link>
            );
          })}
          
        </nav>

        {/* User + Logout */}
        <div className="p-4 border-t border-border/50">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-10 h-10 rounded-full bg-linear-to-br from-cyan-500 to-cyan-600 flex items-center justify-center">
              <span className="text-sm font-bold">
                {user?.name?.charAt(0)?.toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.email}
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            className="w-full justify-start gap-3 mt-2 text-destructive"
            onClick={logout}
          >
            <LogOut className="w-5 h-5" />
            Logout
          </Button>
        </div>
      </aside>

      {/* ================= MOBILE TOP BAR ================= */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 glass border-b border-border/50 z-50 flex items-center justify-between px-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-linear-to-br from-lime-500 to-lime-600 flex items-center justify-center shadow-glow">
            <Flame className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-linear-primary">
            FitForge
          </span>
        </Link>

        <Button
          variant="ghost"
          size="icon"
          className="text-destructive"
          onClick={logout}
        >
          <LogOut className="w-5 h-5" />
        </Button>
      </header>

      {/* ================= MOBILE BOTTOM NAV ================= */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 glass border-t border-border/50 z-40 flex items-center justify-around">
        {mobileNavItems.map((item) => {
          const isActive = isActiveRoute(item.path);

          return (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "flex flex-col items-center justify-center gap-1 text-xs transition rounded-2xl px-2 py-2",
                isActive
                  ? "text-black font-bold bg-primary"
                  : "text-muted-foreground "
              )}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* ================= FLOATING CHAT BOT (FAB) ================= */}
      <Link
        href="/chat-bot"
        className="lg:hidden fixed bottom-20 right-[10px] translate-x-1/2 z-50 mx-10"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          whileTap={{ scale: 0.9 }}
          className="relative w-14 h-14 rounded-full bg-lime-500 shadow-2xl flex items-center justify-center"
        >
          {/* subtle pulse */}
          <motion.span
            animate={{ scale: [1, 1.2, 1], opacity: [0.6, 0.2, 0.6] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute inset-0 rounded-full bg-lime-400 blur-md"
          />
          <BotMessageSquare className="w-6 h-6 text-black relative z-10" />
        </motion.div>
      </Link>
    </>
  );
};

export default Sidebar;
