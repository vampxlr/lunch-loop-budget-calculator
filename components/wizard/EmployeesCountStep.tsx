"use client";

import { StepConfig } from "@/types/schema";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Users, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmployeesCountStepProps {
  step: StepConfig;
  answers: Record<string, any>;
  onChange: (name: string, value: any) => void;
  onValidityChange: (valid: boolean) => void;
}

export function EmployeesCountStep({
  step,
  answers,
  onChange,
  onValidityChange,
}: EmployeesCountStepProps) {
  const field = step.fields[0];
  const value = answers[field.name] ?? field.default ?? field.min ?? 0;

  useEffect(() => {
    if (!answers[field.name] && field.default) {
      onChange(field.name, field.default);
    }
    onValidityChange(true);
  }, []);

  const handleChange = (vals: number[]) => {
    onChange(field.name, vals[0]);
  };

  const increment = () => {
    const newValue = Math.min(value + (field.step || 1), field.max || 100);
    onChange(field.name, newValue);
  };

  const decrement = () => {
    const newValue = Math.max(value - (field.step || 1), field.min || 1);
    onChange(field.name, newValue);
  };

  return (
    <div className="space-y-4 sm:space-y-8">
      <p className="text-base sm:text-lg text-muted-foreground text-center hidden sm:block">
        {field.label}
      </p>

      {/* Big number display with +/- buttons */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, duration: 0.2 }}
        className="flex flex-col items-center justify-center py-4 sm:py-8"
      >
        <div className="glass border-2 border-primary/30 rounded-3xl p-4 sm:p-8 mb-3 shadow-lg shadow-primary/20">
          <div className="flex items-center gap-3 sm:gap-4">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={decrement}
              disabled={value <= (field.min || 1)}
              className="h-12 w-12 sm:h-10 sm:w-10 rounded-full glass hover:bg-primary/10"
            >
              <Minus className="w-5 h-5 sm:w-4 sm:h-4" />
            </Button>
            
            <div className="flex items-center gap-2 sm:gap-4">
              <Users className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
              <motion.span
                key={value}
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.15 }}
                className="text-5xl sm:text-6xl md:text-7xl font-bold text-gradient min-w-[120px] sm:min-w-[140px] text-center"
              >
                {value}
              </motion.span>
            </div>
            
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={increment}
              disabled={value >= (field.max || 100)}
              className="h-12 w-12 sm:h-10 sm:w-10 rounded-full glass hover:bg-primary/10"
            >
              <Plus className="w-5 h-5 sm:w-4 sm:h-4" />
            </Button>
          </div>
        </div>
        <p className="text-muted-foreground text-sm">employees</p>
      </motion.div>

      {/* Slider */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="px-2 sm:px-4"
      >
        <Slider
          value={[value]}
          onValueChange={handleChange}
          min={field.min || 1}
          max={field.max || 100}
          step={field.step || 1}
          className="w-full touch-pan-y"
        />
        <div className="flex justify-between mt-2 sm:mt-3 text-xs sm:text-sm text-muted-foreground px-1">
          <span>{field.min || 1}</span>
          <span className="text-xs text-muted-foreground/60">
            Tap +/- or drag slider
          </span>
          <span>{field.max || 100}</span>
        </div>
      </motion.div>
    </div>
  );
}
