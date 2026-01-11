"use client";

import { StepConfig } from "@/types/schema";
import { DialSlider } from "@/components/ui/dial-slider";
import { useEffect } from "react";

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

  const handleChange = (newValue: number) => {
    onChange(field.name, newValue);
  };

  return (
    <DialSlider
      value={value}
      min={field.min || 1}
      max={field.max || 100}
      step={field.step || 1}
      onChange={handleChange}
      label={field.label}
      unit="employees"
    />
  );
}
