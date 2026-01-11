"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepperProgressProps {
  steps: string[];
  currentStep: number;
  className?: string;
}

export function StepperProgress({
  steps,
  currentStep,
  className,
}: StepperProgressProps) {
  return (
    <div className={cn("w-full", className)}>
      {/* Progress bar */}
      <div className="relative mb-8">
        <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary via-secondary to-accent"
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          />
        </div>
      </div>

      {/* Step indicators */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isFuture = index > currentStep;

          return (
            <div
              key={index}
              className="flex flex-col items-center gap-2 flex-1"
            >
              <motion.div
                className={cn(
                  "relative flex items-center justify-center",
                  "w-10 h-10 rounded-full border-2 transition-all duration-300",
                  isCompleted && "bg-primary border-primary",
                  isCurrent && "bg-primary/20 border-primary scale-110",
                  isFuture && "bg-muted border-muted-foreground/30"
                )}
                initial={false}
                animate={{
                  scale: isCurrent ? 1.1 : 1,
                }}
              >
                {isCompleted ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <Check className="w-5 h-5 text-primary-foreground" />
                  </motion.div>
                ) : (
                  <span
                    className={cn(
                      "text-sm font-semibold",
                      isCurrent && "text-primary",
                      isFuture && "text-muted-foreground"
                    )}
                  >
                    {index + 1}
                  </span>
                )}

                {/* Glow effect for current step */}
                {isCurrent && (
                  <motion.div
                    className="absolute inset-0 rounded-full bg-primary/30 blur-md -z-10"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </motion.div>

              {/* Step label */}
              <span
                className={cn(
                  "text-xs text-center font-medium transition-colors duration-300 hidden sm:block",
                  (isCompleted || isCurrent) && "text-foreground",
                  isFuture && "text-muted-foreground"
                )}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
