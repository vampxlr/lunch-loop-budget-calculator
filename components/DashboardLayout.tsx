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
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (!requireAuth()) {
      router.push("/dashboard/login");
    }
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMounted]);

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
      <header
        className={cn(
          "sticky top-0 z-50 border-b transition-all duration-300",
          scrolled
            ? "glass-strong border-border/50 shadow-lg"
            : "bg-transparent border-transparent"
        )}
        suppressHydrationWarning
      >
        <div className="container flex h-16 items-center justify-between" suppressHydrationWarning>
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2 rounded-lg glass hover:border-primary transition-colors active:scale-95"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
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
            </button>
            <Link href="/dashboard">
              <div
                className="flex items-center gap-2 group hover:scale-[1.02] active:scale-[0.98] transition-transform"
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
              </div>
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
      </header>

      <div className="container flex max-w-full overflow-x-hidden">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-40 w-64 glass-strong border-r border-border/50 pt-16 lg:static lg:translate-x-0",
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
            "transition-transform duration-300 ease-in-out"
          )}
        >
          <nav className="space-y-2 p-4 overflow-y-auto max-h-screen" suppressHydrationWarning>
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);

              return (
                <div
                  key={item.href}
                  style={{
                    animation: isMounted ? `fadeInLeft 0.3s ease-out ${index * 0.1}s both` : 'none'
                  }}
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
                      <div
                        className="absolute inset-0 bg-primary/10 blur-xl -z-10 transition-all duration-300"
                      />
                    )}
                    <Icon className={cn("h-5 w-5", isActive && "text-primary")} />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </div>
              );
            })}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6 lg:p-8 min-w-0 overflow-x-hidden">{children}</main>
      </div>

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-background/80 backdrop-blur lg:hidden transition-opacity duration-200"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}
