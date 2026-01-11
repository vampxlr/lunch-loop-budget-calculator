"use client";

import { StepConfig } from "@/types/schema";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Users } from "lucide-react";

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

  return (
    <div className="space-y-8">
      <p className="text-lg text-muted-foreground text-center">
        {field.label}
      </p>

      {/* Big number display */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="flex flex-col items-center justify-center py-8"
      >
        <div className="glass border-2 border-primary/30 rounded-3xl p-8 mb-4 shadow-lg shadow-primary/20">
          <div className="flex items-center gap-4">
            <Users className="w-10 h-10 text-primary" />
            <motion.span
              key={value}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-6xl md:text-7xl font-bold text-gradient"
            >
              {value}
            </motion.span>
          </div>
        </div>
        <p className="text-muted-foreground text-sm">employees</p>
      </motion.div>

      {/* Slider */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="px-4"
      >
        <Slider
          value={[value]}
          onValueChange={handleChange}
          min={field.min || 1}
          max={field.max || 100}
          step={field.step || 1}
          className="w-full"
        />
        <div className="flex justify-between mt-3 text-sm text-muted-foreground">
          <span>{field.min || 1}</span>
          <span>{field.max || 100}</span>
        </div>
      </motion.div>
    </div>
  );
}
