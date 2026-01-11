"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";

interface GlobalNavProps {
  className?: string;
  showDashboardLink?: boolean;
}

export function GlobalNav({ className, showDashboardLink = false }: GlobalNavProps) {
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-all duration-300",
        scrolled
          ? "glass-strong border-border/50 shadow-lg"
          : "bg-transparent border-transparent",
        className
      )}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <motion.div
              className="flex items-center gap-2 group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-lg blur-md opacity-50 group-hover:opacity-75 transition-opacity" />
                <div className="relative bg-gradient-to-r from-primary to-secondary p-2 rounded-lg">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-gradient">
                  Lunch Loop
                </span>
                <span className="text-xs text-muted-foreground -mt-1 hidden sm:block">
                  Office Lunch Planner
                </span>
              </div>
            </motion.div>
          </Link>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {showDashboardLink && (
              <Link href="/dashboard">
                <motion.div
                  className="flex items-center gap-2 px-4 py-2 rounded-lg glass hover:border-primary transition-all duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span className="font-medium hidden sm:inline">Dashboard</span>
                </motion.div>
              </Link>
            )}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
