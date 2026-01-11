"use client";

import { StepConfig } from "@/types/schema";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils";

interface BudgetStepProps {
  step: StepConfig;
  answers: Record<string, any>;
  onChange: (name: string, value: any) => void;
  onValidityChange: (valid: boolean) => void;
  onAutoAdvance?: () => void;
}

export function BudgetStep({
  step,
  answers,
  onChange,
  onValidityChange,
  onAutoAdvance,
}: BudgetStepProps) {
  const field = step.fields[0];
  const value = answers[field.name];
  const budgetType = answers.budget_type || "standard";
  const [showCustom, setShowCustom] = useState(false);
  const [customValue, setCustomValue] = useState("");

  useEffect(() => {
    if (value) {
      onValidityChange(true);
    }
  }, [value]);

  const handlePresetSelect = (optionValue: number, type: string) => {
    onChange(field.name, optionValue);
    onChange("budget_type", type);
    setShowCustom(false);
    onValidityChange(true);

    if (step.autoAdvance && onAutoAdvance) {
      setTimeout(() => {
        onAutoAdvance();
      }, 200);
    }
  };

  const handleCustomSelect = () => {
    setShowCustom(true);
    onChange("budget_type", "custom");
    if (customValue) {
      onChange(field.name, parseFloat(customValue));
      onValidityChange(true);
    } else {
      onValidityChange(false);
    }
  };

  const handleCustomChange = (val: string) => {
    setCustomValue(val);
    const numVal = parseFloat(val);
    if (!isNaN(numVal) && numVal > 0) {
      onChange(field.name, numVal);
      onChange("budget_type", "custom");
      onValidityChange(true);
    } else {
      onValidityChange(false);
    }
  };

  return (
    <div className="space-y-8">
      <p className="text-lg text-muted-foreground text-center">
        {field.label}
      </p>

      <div className="grid gap-4">
        {field.options?.map((option, index) => {
          const isSelected = budgetType === option.label.toLowerCase() && !showCustom;
          return (
            <motion.button
              key={option.value}
              type="button"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05, duration: 0.2 }}
              onClick={() => handlePresetSelect(option.value as number, option.label.toLowerCase())}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "relative p-6 rounded-xl border-2 transition-all text-left glass",
                isSelected
                  ? "border-primary bg-gradient-to-br from-primary/20 to-secondary/10 shadow-lg shadow-primary/30"
                  : "border-border/50 hover:border-primary/50"
              )}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xl font-bold">{option.label}</div>
                  <div className="text-base text-muted-foreground mt-1">
                    {formatCurrency(option.value as number)} per person
                  </div>
                </div>
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="h-8 w-8 rounded-full bg-primary flex items-center justify-center"
                  >
                    <svg
                      className="h-5 w-5 text-primary-foreground"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                )}
              </div>
              
              {/* Glow effect for selected */}
              {isSelected && (
                <motion.div
                  className="absolute inset-0 rounded-xl bg-primary/20 blur-xl -z-10"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                />
              )}
            </motion.button>
          );
        })}

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15, duration: 0.2 }}
          className={cn(
            "p-6 rounded-xl border-2 transition-all glass",
            showCustom
              ? "border-primary bg-gradient-to-br from-primary/20 to-secondary/10"
              : "border-border/50 hover:border-primary/50"
          )}
        >
          {!showCustom ? (
            <button
              type="button"
              onClick={handleCustomSelect}
              className="w-full text-left text-xl font-bold"
            >
              Custom Budget
            </button>
          ) : (
            <div className="space-y-3">
              <Label htmlFor="custom-budget" className="text-base">
                Enter Your Custom Budget
              </Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-muted-foreground">
                  $
                </span>
                <Input
                  id="custom-budget"
                  type="number"
                  placeholder="0.00"
                  value={customValue}
                  onChange={(e) => handleCustomChange(e.target.value)}
                  autoFocus
                  min="0"
                  step="10"
                  className="pl-8 h-12 text-lg glass border-2 border-primary"
                />
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
