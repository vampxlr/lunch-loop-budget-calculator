"use client";

import { StepConfig } from "@/types/schema";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface DaysPerWeekStepProps {
  step: StepConfig;
  answers: Record<string, any>;
  onChange: (name: string, value: any) => void;
  onValidityChange: (valid: boolean) => void;
  onAutoAdvance?: () => void;
}

export function DaysPerWeekStep({
  step,
  answers,
  onChange,
  onValidityChange,
  onAutoAdvance,
}: DaysPerWeekStepProps) {
  const field = step.fields[0];
  const value = answers[field.name];

  useEffect(() => {
    onValidityChange(!!value);
  }, [value]);

  const handleSelect = (optionValue: number) => {
    onChange(field.name, optionValue);
    onValidityChange(true);
    
    // Auto-advance if enabled - faster timing
    if (step.autoAdvance && onAutoAdvance) {
      setTimeout(() => {
        onAutoAdvance();
      }, 200);
    }
  };

  return (
    <div className="space-y-8">
      <p className="text-lg text-muted-foreground text-center">
        {field.label}
      </p>
      
      <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
        {field.options?.map((option, index) => {
          const isSelected = value === option.value;
          return (
            <motion.button
              key={option.value}
              type="button"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.03, duration: 0.2 }}
              onClick={() => handleSelect(option.value as number)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "relative aspect-square rounded-xl text-2xl font-bold transition-all",
                "glass border-2",
                isSelected
                  ? "border-primary bg-gradient-to-br from-primary/20 to-secondary/10 shadow-lg shadow-primary/30"
                  : "border-border/50 hover:border-primary/50"
              )}
            >
              <span className={cn(
                "transition-all",
                isSelected ? "text-gradient" : "text-foreground"
              )}>
                {option.label}
              </span>
              
              {/* Check mark for selected */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center"
                >
                  <Check className="w-4 h-4 text-primary-foreground" />
                </motion.div>
              )}

              {/* Glow effect for selected */}
              {isSelected && (
                <motion.div
                  className="absolute inset-0 rounded-xl bg-primary/20 blur-xl -z-10"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
      
      {value && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-base text-muted-foreground text-center font-medium"
        >
          {value} {value === 1 ? "day" : "days"} per week selected
        </motion.p>
      )}
    </div>
  );
}
