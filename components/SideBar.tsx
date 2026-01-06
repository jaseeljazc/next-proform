"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Utensils,
  Dumbbell,
  TrendingUp,
  BookOpen,
  LogOut,
  Menu,
  X,
  Flame,
  BotMessageSquare
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Utensils, label: "Meal Plans", path: "/meal-plans" },
  { icon: Dumbbell, label: "Workouts", path: "/workouts" },
  { icon: TrendingUp, label: "Progress", path: "/progress" },
  { icon: BookOpen, label: "Saved Plans", path: "/saved-plans" },
  { icon: BotMessageSquare, label: "Chat Bot", path: "/chat-bot" },
];

const Sidebar = () => {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActiveRoute = (path: string) =>
    pathname === path || pathname.startsWith(path + "/");

  return (
    <>
      {/* ================= Desktop Sidebar ================= */}
      <aside className="hidden lg:flex w-64 flex-col glass-card border-r border-border/50 fixed h-screen z-40">
        {/* Logo */}
        <div className="p-6 border-b border-border/50">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-lime-500 to-lime-600 flex items-center justify-center shadow-glow">
              <Flame className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-linear-primary">
              FitForge
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = isActiveRoute(item.path);

            return (
              <Link key={item.path} href={item.path}>
                <motion.div
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    "relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                    isActive
                      ? "bg-lime-500 text-black shadow-glow"
                      : "hover:bg-muted hover:text-foreground"
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
              <span className="text-sm font-bold text-foreground">
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
            className="w-full justify-start gap-3 mt-2 text-destructive hover:bg-destructive/10"
            onClick={logout}
          >
            <LogOut className="w-5 h-5" />
            <Link href="/">Logout</Link>
          </Button>
        </div>
      </aside>

      {/* ================= Mobile Header ================= */}
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
          onClick={() => setIsMobileMenuOpen((v) => !v)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </Button>
      </header>

      {/* ================= Mobile Menu ================= */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25 }}
            className="lg:hidden fixed inset-0 top-16 z-40 glass-card"
          >
            <nav className="p-4 space-y-2">
              {navItems.map((item) => {
                const isActive = isActiveRoute(item.path);

                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-xl",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      )}
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </div>
                  </Link>
                );
              })}

              <Button
                variant="ghost"
                className="w-full justify-start gap-3 mt-4 text-destructive"
                onClick={() => {
                  logout();
                  setIsMobileMenuOpen(false);
                }}
              >
                <LogOut className="w-5 h-5" />
                <Link href="/">Logout</Link>
              </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
