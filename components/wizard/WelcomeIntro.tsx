"use client";

import { motion } from "framer-motion";
import { MotionButton } from "@/components/ui/motion-button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ArrowRight, Utensils, Calculator, Clock } from "lucide-react";

interface WelcomeIntroProps {
  onStart: () => void;
}

export function WelcomeIntro({ onStart }: WelcomeIntroProps) {
  const features = [
    { icon: Utensils, text: "Plan office lunches" },
    { icon: Calculator, text: "Calculate costs" },
    { icon: Clock, text: "Takes 2 minutes" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      {/* Theme Toggle in top-right corner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="absolute top-6 right-6 z-50"
      >
        <ThemeToggle />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-md"
      >
        {/* Logo/Icon with spinning animation */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mb-8 inline-block"
        >
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-2xl shadow-primary/30">
              <Utensils className="w-12 h-12 text-white" />
            </div>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary to-accent opacity-50 blur-xl -z-10"
            />
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-4xl md:text-5xl font-bold mb-4"
        >
          <span className="text-gradient">Lunch Loop</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-xl text-muted-foreground mb-8"
        >
          Office Lunch Budget Planner
        </motion.p>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-foreground/80 mb-8 leading-relaxed"
        >
          Estimate your team's lunch costs in just a few simple steps.
          Get instant pricing calculations tailored to your needs.
        </motion.p>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex justify-center gap-6 mb-10"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className="flex flex-col items-center gap-2"
            >
              <div className="w-12 h-12 rounded-xl glass border border-border/50 flex items-center justify-center">
                <feature.icon className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xs text-muted-foreground">{feature.text}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9 }}
        >
          <MotionButton
            onClick={onStart}
            size="lg"
            variant="primary"
            shimmer
            glow
            className="group text-lg font-semibold px-8 py-6 rounded-xl shadow-xl shadow-primary/25"
          >
            <motion.span
              className="flex items-center gap-2"
              whileHover={{ x: 5 }}
            >
              Get Started
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.span>
          </MotionButton>
        </motion.div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="mt-8 text-sm text-muted-foreground"
        >
          Free to use. No account required.
        </motion.p>
      </motion.div>
    </div>
  );
}
