"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "./ThemeToggle";
import { MotionButton } from "./ui/motion-button";
import { requireAuth, clearAuthSession, isAuthRequired } from "@/lib/auth";
import {
  LayoutDashboard,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (!requireAuth()) {
      router.push("/dashboard/login");
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    clearAuthSession();
    router.push("/dashboard/login");
  };

  const navItems = [
    {
      href: "/dashboard",
      label: "Overview",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      href: "/dashboard/planner-editor",
      label: "Planner Editor",
      icon: Settings,
      exact: false,
    },
  ];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Header */}
      <motion.header
        className={cn(
          "sticky top-0 z-50 border-b transition-all duration-300",
          scrolled
            ? "glass-strong border-border/50 shadow-lg"
            : "bg-transparent border-transparent"
        )}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      >
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.button
              className="lg:hidden p-2 rounded-lg glass hover:border-primary transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileTap={{ scale: 0.95 }}
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="h-6 w-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="h-6 w-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
            <Link href="/dashboard">
              <motion.div
                className="flex items-center gap-2 group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-lg blur-md opacity-50 group-hover:opacity-75 transition-opacity" />
                  <div className="relative h-8 w-8 rounded-lg bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                    <span className="text-white font-bold text-lg">LL</span>
                  </div>
                </div>
                <span className="font-bold hidden sm:inline text-gradient">
                  Lunch Loop Admin
                </span>
              </motion.div>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            {isAuthRequired() && (
              <MotionButton
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="gap-2"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </MotionButton>
            )}
          </div>
        </div>
      </motion.header>

      <div className="container flex max-w-full overflow-x-hidden">
        {/* Sidebar */}
        <motion.aside
          className={cn(
            "fixed inset-y-0 left-0 z-40 w-64 glass-strong border-r border-border/50 pt-16 transition-transform lg:static lg:translate-x-0",
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          )}
          initial={false}
          animate={{ x: isMobileMenuOpen || (isClient && window.innerWidth >= 1024) ? 0 : -256 }}
        >
          <nav className="space-y-2 p-4 overflow-y-auto max-h-screen">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);

              return (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-4 py-3 transition-all relative overflow-hidden group",
                      isActive
                        ? "bg-gradient-to-r from-primary/20 to-secondary/10 text-foreground border border-primary/30"
                        : "glass hover:border-primary/50"
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {isActive && (
                      <motion.div
                        className="absolute inset-0 bg-primary/10 blur-xl -z-10"
                        layoutId="activeNav"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    <Icon className={cn("h-5 w-5", isActive && "text-primary")} />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </motion.div>
              );
            })}
          </nav>
        </motion.aside>

        {/* Main content */}
        <main className="flex-1 p-6 lg:p-8 min-w-0 overflow-x-hidden">{children}</main>
      </div>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-background/80 backdrop-blur lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
