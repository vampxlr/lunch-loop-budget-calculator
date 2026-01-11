"use client";

import { StepConfig } from "@/types/schema";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Mail, Phone, Building2 } from "lucide-react";

interface ContactStepProps {
  step: StepConfig;
  answers: Record<string, any>;
  onChange: (name: string, value: any) => void;
  onValidityChange: (valid: boolean) => void;
}

export function ContactStep({ step, answers, onChange, onValidityChange }: ContactStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    validateAll();
  }, [answers]);

  const validateField = (field: any, value: string): string | null => {
    if (field.required && !value) {
      return `${field.label} is required`;
    }

    if (value && field.validation?.pattern) {
      const regex = new RegExp(field.validation.pattern);
      if (!regex.test(value)) {
        return field.validation.message || `Invalid ${field.label}`;
      }
    }

    return null;
  };

  const validateAll = () => {
    const newErrors: Record<string, string> = {};
    let allValid = true;

    step.fields.forEach((field) => {
      const value = answers[field.name] || "";
      const error = validateField(field, value);
      if (error) {
        newErrors[field.name] = error;
        allValid = false;
      }
    });

    setErrors(newErrors);
    onValidityChange(allValid);
  };

  const handleChange = (name: string, value: string) => {
    onChange(name, value);
    
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const getIcon = (fieldName: string) => {
    if (fieldName === "email") return <Mail className="w-5 h-5 text-muted-foreground" />;
    if (fieldName === "phone") return <Phone className="w-5 h-5 text-muted-foreground" />;
    if (fieldName === "company_name") return <Building2 className="w-5 h-5 text-muted-foreground" />;
    return null;
  };

  return (
    <div className="space-y-6">
      {step.fields.map((field, index) => (
        <motion.div
          key={field.name}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="space-y-2"
        >
          <Label htmlFor={field.name} className="text-base">
            {field.label}
            {field.required && <span className="text-danger ml-1">*</span>}
          </Label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              {getIcon(field.name)}
            </div>
            <Input
              id={field.name}
              type={field.type === "email" ? "email" : field.type === "phone" ? "tel" : "text"}
              placeholder={field.placeholder}
              value={answers[field.name] || ""}
              onChange={(e) => handleChange(field.name, e.target.value)}
              className={`pl-12 h-12 glass border-2 ${
                errors[field.name] 
                  ? "border-danger focus:border-danger" 
                  : "border-border/50 focus:border-primary"
              }`}
            />
          </div>
          {errors[field.name] && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-danger flex items-center gap-1"
            >
              <span>⚠</span> {errors[field.name]}
            </motion.p>
          )}
        </motion.div>
      ))}
    </div>
  );
}
