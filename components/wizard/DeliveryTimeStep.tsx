"use client";

import { StepConfig } from "@/types/schema";
import { TimePicker12h } from "@/components/ui/time-picker-12h";
import { useEffect, useState } from "react";
import { time24to12, time12to24 } from "@/lib/utils";

interface DeliveryTimeStepProps {
  step: StepConfig;
  answers: Record<string, any>;
  onChange: (name: string, value: any) => void;
  onValidityChange: (valid: boolean) => void;
}

export function DeliveryTimeStep({
  step,
  answers,
  onChange,
  onValidityChange,
}: DeliveryTimeStepProps) {
  const field = step.fields[0];
  const value24 = answers[field.name] || field.default || "12:30";
  const { hour, minute, period } = time24to12(value24);

  const [selectedHour, setSelectedHour] = useState(hour);
  const [selectedMinute, setSelectedMinute] = useState(minute);
  const [selectedPeriod, setSelectedPeriod] = useState<"AM" | "PM">(period);

  useEffect(() => {
    onValidityChange(true);
  }, []);

  useEffect(() => {
    const time24 = time12to24(selectedHour, selectedMinute, selectedPeriod);
    onChange(field.name, time24);
  }, [selectedHour, selectedMinute, selectedPeriod]);

  return (
    <div className="flex flex-col items-center justify-center">
      <p className="text-lg text-muted-foreground mb-8 text-center">
        {field.label}
      </p>
      <TimePicker12h
        hour={selectedHour}
        minute={selectedMinute}
        period={selectedPeriod}
        onHourChange={setSelectedHour}
        onMinuteChange={setSelectedMinute}
        onPeriodChange={setSelectedPeriod}
      />
    </div>
  );
}
