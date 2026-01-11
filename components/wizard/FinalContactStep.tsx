"use client";

import { useState, useEffect } from "react";
import { StepConfig } from "@/types/schema";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Mail, Phone, CheckCircle2, Circle } from "lucide-react";

interface FinalContactStepProps {
  step: StepConfig;
  answers: Record<string, any>;
  onChange: (name: string, value: any) => void;
  onValidityChange: (valid: boolean) => void;
}

export function FinalContactStep({
  step,
  answers,
  onChange,
  onValidityChange,
}: FinalContactStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    validateAll();
  }, [answers]);

  const validateEmail = (email: string): string | null => {
    if (!email) {
      return "Email is required";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }
    return null;
  };

  const validatePhone = (phone: string): string | null => {
    if (!phone) return null; // Phone is optional
    const phoneRegex = /^[\d\s\-+()]+$/;
    if (!phoneRegex.test(phone)) {
      return "Please enter a valid phone number";
    }
    return null;
  };

  const validateAll = () => {
    const newErrors: Record<string, string> = {};
    let allValid = true;

    // Validate email (required)
    const emailError = validateEmail(answers.email || "");
    if (emailError) {
      newErrors.email = emailError;
      allValid = false;
    }

    // Validate phone (optional)
    const phoneError = validatePhone(answers.phone || "");
    if (phoneError) {
      newErrors.phone = phoneError;
      allValid = false;
    }

    setErrors(newErrors);
    onValidityChange(allValid);
  };

  const handleChange = (name: string, value: any) => {
    onChange(name, value);
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    onChange(name, checked);
  };

  const hasPhone = !!answers.phone && answers.phone.trim().length > 0;

  return (
    <div className="space-y-8">
      {/* Email and Phone Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6 p-6 rounded-xl glass border border-border/50"
      >
        <div>
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <Mail className="w-5 h-5 text-primary" />
            Where should we send your results?
          </h3>
          <p className="text-sm text-muted-foreground">
            Enter your email to receive a copy of your cost breakdown.
          </p>
        </div>

        {/* Email Field */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-2"
        >
          <Label htmlFor="email" className="text-base">
            Email Address <span className="text-danger">*</span>
          </Label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <Mail className="w-5 h-5 text-muted-foreground" />
            </div>
            <Input
              id="email"
              type="email"
              placeholder="your.email@company.com"
              value={answers.email || ""}
              onChange={(e) => handleChange("email", e.target.value)}
              className={`pl-12 h-12 glass border-2 ${
                errors.email
                  ? "border-danger focus:border-danger"
                  : "border-border/50 focus:border-primary"
              }`}
            />
          </div>
          {errors.email && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-danger flex items-center gap-1"
            >
              <span>⚠</span> {errors.email}
            </motion.p>
          )}
        </motion.div>

        {/* Phone Field */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          className="space-y-2"
        >
          <Label htmlFor="phone" className="text-base">
            Phone Number
            <span className="text-muted-foreground font-normal text-sm ml-2">
              (Optional)
            </span>
          </Label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <Phone className="w-5 h-5 text-muted-foreground" />
            </div>
            <Input
              id="phone"
              type="tel"
              placeholder="+880 1700-000000"
              value={answers.phone || ""}
              onChange={(e) => handleChange("phone", e.target.value)}
              className={`pl-12 h-12 glass border-2 ${
                errors.phone
                  ? "border-danger focus:border-danger"
                  : "border-border/50 focus:border-primary"
              }`}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Optional — add your number if you want SMS discounts
          </p>
          {errors.phone && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-danger flex items-center gap-1"
            >
              <span>⚠</span> {errors.phone}
            </motion.p>
          )}
        </motion.div>
      </motion.div>

      {/* Promotional Offers Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4 p-6 rounded-xl glass border border-border/50"
      >
        <div>
          <h3 className="text-lg font-semibold mb-2">
            Stay Updated with Exclusive Offers
          </h3>
          <p className="text-sm text-muted-foreground">
            Yes, send me free exclusive promotional offers or discounts
          </p>
        </div>

        {/* Email Opt-in */}
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25 }}
          type="button"
          onClick={() =>
            handleCheckboxChange("promo_opt_in_email", !answers.promo_opt_in_email)
          }
          className="w-full flex items-center gap-3 p-4 rounded-lg glass border border-border/50 hover:border-primary/50 transition-all cursor-pointer group"
        >
          <div className="flex-shrink-0">
            {answers.promo_opt_in_email ? (
              <CheckCircle2 className="w-6 h-6 text-primary" />
            ) : (
              <Circle className="w-6 h-6 text-muted-foreground group-hover:text-primary" />
            )}
          </div>
          <div className="text-left">
            <p className="font-medium">Email</p>
            <p className="text-sm text-muted-foreground">
              Receive offers via email
            </p>
          </div>
        </motion.button>

        {/* SMS Opt-in */}
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          type="button"
          disabled={!hasPhone}
          onClick={() => {
            if (hasPhone) {
              handleCheckboxChange("promo_opt_in_sms", !answers.promo_opt_in_sms);
            }
          }}
          className={`w-full flex items-center gap-3 p-4 rounded-lg border transition-all cursor-pointer group ${
            hasPhone
              ? "glass border-border/50 hover:border-primary/50"
              : "bg-muted/30 border-border/30 cursor-not-allowed opacity-60"
          }`}
        >
          <div className="flex-shrink-0">
            {answers.promo_opt_in_sms && hasPhone ? (
              <CheckCircle2 className="w-6 h-6 text-primary" />
            ) : (
              <Circle className="w-6 h-6 text-muted-foreground" />
            )}
          </div>
          <div className="text-left">
            <p className="font-medium">SMS</p>
            <p className="text-sm text-muted-foreground">
              {hasPhone
                ? "Receive offers via SMS"
                : "Add a phone number to enable SMS"}
            </p>
          </div>
        </motion.button>
      </motion.div>
    </div>
  );
}
