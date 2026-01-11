"use client";

import { StepConfig } from "@/types/schema";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";

interface PromoOffersStepProps {
  step: StepConfig;
  answers: Record<string, any>;
  onChange: (name: string, value: any) => void;
  onValidityChange: (valid: boolean) => void;
  onAutoAdvance?: () => void;
}

export function PromoOffersStep({
  step,
  answers,
  onChange,
  onValidityChange,
  onAutoAdvance,
}: PromoOffersStepProps) {
  const field = step.fields[0];
  const value = answers[field.name];

  useEffect(() => {
    onValidityChange(value !== undefined);
  }, [value]);

  const handleSelect = (choice: boolean) => {
    onChange(field.name, choice);
    onValidityChange(true);

    if (step.autoAdvance && onAutoAdvance) {
      setTimeout(() => {
        onAutoAdvance();
      }, 300);
    }
  };

  return (
    <div className="space-y-8">
      <p className="text-lg text-muted-foreground text-center">
        {field.label}
      </p>

      <div className="grid sm:grid-cols-2 gap-6">
        <motion.button
          type="button"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          onClick={() => handleSelect(true)}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className={cn(
            "relative p-8 rounded-2xl border-2 transition-all flex flex-col items-center gap-4 glass",
            value === true
              ? "border-success bg-gradient-to-br from-success/20 to-success/5 shadow-lg shadow-success/30"
              : "border-border/50 hover:border-success/50"
          )}
        >
          <motion.div
            className={cn(
              "h-20 w-20 rounded-full flex items-center justify-center",
              value === true
                ? "bg-gradient-to-br from-success to-success/80"
                : "bg-muted"
            )}
            animate={value === true ? { rotate: [0, 5, -5, 0] } : {}}
            transition={{ duration: 0.5 }}
          >
            <Check
              className={cn(
                "h-10 w-10",
                value === true ? "text-white" : "text-muted-foreground"
              )}
            />
          </motion.div>
          <div className="text-2xl font-bold">Yes, Please!</div>
          <div className="text-sm text-muted-foreground text-center">
            Send me exclusive discounts and offers
          </div>
          
          {/* Glow effect for selected */}
          {value === true && (
            <motion.div
              className="absolute inset-0 rounded-2xl bg-success/20 blur-xl -z-10"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
        </motion.button>

        <motion.button
          type="button"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          onClick={() => handleSelect(false)}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className={cn(
            "relative p-8 rounded-2xl border-2 transition-all flex flex-col items-center gap-4 glass",
            value === false
              ? "border-primary bg-gradient-to-br from-primary/20 to-secondary/10 shadow-lg shadow-primary/30"
              : "border-border/50 hover:border-primary/50"
          )}
        >
          <motion.div
            className={cn(
              "h-20 w-20 rounded-full flex items-center justify-center",
              value === false
                ? "bg-gradient-to-br from-primary to-secondary"
                : "bg-muted"
            )}
            animate={value === false ? { rotate: [0, -5, 5, 0] } : {}}
            transition={{ duration: 0.5 }}
          >
            <X
              className={cn(
                "h-10 w-10",
                value === false ? "text-white" : "text-muted-foreground"
              )}
            />
          </motion.div>
          <div className="text-2xl font-bold">No Thanks</div>
          <div className="text-sm text-muted-foreground text-center">
            Just send me the estimate
          </div>
          
          {/* Glow effect for selected */}
          {value === false && (
            <motion.div
              className="absolute inset-0 rounded-2xl bg-primary/20 blur-xl -z-10"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
        </motion.button>
      </div>
    </div>
  );
}
