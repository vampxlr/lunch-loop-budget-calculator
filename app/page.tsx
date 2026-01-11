"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { AuroraBackground } from "@/components/blocks/AuroraBackground";
import { AnimatedBackground } from "@/components/blocks/AnimatedBackground";
import { GlobalNav } from "@/components/blocks/GlobalNav";
import { WelcomeIntro } from "@/components/wizard/WelcomeIntro";
import {
  GlassCard,
  GlassCardHeader,
  GlassCardTitle,
  GlassCardDescription,
  GlassCardContent,
} from "@/components/ui/glass-card";
import { MotionButton } from "@/components/ui/motion-button";
import { StepperProgress } from "@/components/ui/stepper-progress";
import { ContactStep } from "@/components/wizard/ContactStep";
import { EmployeesCountStep } from "@/components/wizard/EmployeesCountStep";
import { DaysPerWeekStep } from "@/components/wizard/DaysPerWeekStep";
import { DeliveryTimeStep } from "@/components/wizard/DeliveryTimeStep";
import { BudgetStep } from "@/components/wizard/BudgetStep";
import { TastingStep } from "@/components/wizard/TastingStep";
import { PromoOffersStep } from "@/components/wizard/PromoOffersStep";
import { loadSchema } from "@/lib/storage";
import { calculateCosts } from "@/lib/pricing";
import { saveSubmission, logEvent } from "@/lib/storage";
import { PlannerSchema, StepConfig } from "@/types/schema";
import { SubmissionAnswers } from "@/types/submission";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";

export default function WizardPage() {
  const router = useRouter();
  const [showIntro, setShowIntro] = useState(true);
  const [schema, setSchema] = useState<PlannerSchema | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isStepValid, setIsStepValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");

  useEffect(() => {
    loadSchema().then(setSchema);
  }, []);

  if (!schema) {
    return (
      <>
        <AnimatedBackground />
        <div className="min-h-screen flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-strong p-8 rounded-2xl"
          >
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
            <p className="text-center mt-4 text-muted-foreground">Loading planner...</p>
          </motion.div>
        </div>
      </>
    );
  }

  if (showIntro) {
    return (
      <>
        <AnimatedBackground />
        <WelcomeIntro onStart={() => setShowIntro(false)} />
      </>
    );
  }

  const enabledSteps = schema.steps.filter((s) => s.enabled);
  const currentStep = enabledSteps[currentStepIndex];
  const isLastStep = currentStepIndex === enabledSteps.length - 1;
  const stepLabels = enabledSteps.map((s) => s.title);

  const handleAnswer = (name: string, value: any) => {
    setAnswers((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = async () => {
    if (isLastStep) {
      await handleSubmit();
    } else {
      setDirection("forward");
      setCurrentStepIndex((prev) => prev + 1);
      setIsStepValid(false);
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setDirection("backward");
      setCurrentStepIndex((prev) => prev - 1);
      setIsStepValid(true);
    }
  };

  const handleAutoAdvance = () => {
    if (!isLastStep && isStepValid) {
      handleNext();
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const submissionAnswers: SubmissionAnswers = {
        email: answers.email,
        phone: answers.phone,
        company_name: answers.company_name,
        employees_count: answers.employees_count,
        days_per_week: answers.days_per_week,
        delivery_time: answers.delivery_time,
        budget_per_person: answers.budget_per_person,
        budget_type: answers.budget_type,
        free_tasting_interest: answers.free_tasting_interest,
        promo_opt_in: answers.promo_opt_in,
      };

      const costs = calculateCosts(submissionAnswers, schema.pricing);
      const submissionId = await saveSubmission(submissionAnswers, costs);

      await logEvent(submissionId, "submission.created", "wizard", "success");
      await logEvent(
        submissionId,
        "pricing.calculated",
        "wizard",
        "success",
        undefined,
        costs
      );

      // Send results email
      await logEvent(submissionId, "email.send.requested", "wizard", "success");
      
      try {
        const emailResponse = await fetch("/api/email/send-results", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            submission_id: submissionId,
            to_email: answers.email,
            to_phone_optional: answers.phone,
            answers_json: submissionAnswers,
            computed_costs: {
              cost_per_person: costs.cost_per_person,
              daily_cost: costs.daily_cost,
              weekly_cost: costs.weekly_cost,
              monthly_cost: costs.monthly_cost,
              delivery_modifier: costs.delivery_modifier,
            },
            promo_opt_in: answers.promo_opt_in,
            free_tasting_interest: answers.free_tasting_interest,
            timestamp: new Date().toISOString(),
          }),
        });

        const emailResult = await emailResponse.json();
        
        if (emailResult.status === "sent") {
          await logEvent(submissionId, "email.sent", "wizard", "success", "Email sent successfully");
        } else if (emailResult.status === "skipped") {
          await logEvent(submissionId, "email.skipped", "wizard", "skipped", emailResult.message || "SMTP not configured");
        } else {
          await logEvent(submissionId, "email.failed", "wizard", "failed", emailResult.message || "Failed to send email");
        }
      } catch (emailError) {
        console.error("Email error:", emailError);
        await logEvent(submissionId, "email.failed", "wizard", "failed", "Email API request failed");
      }

      router.push(`/results/${submissionId}`);
    } catch (error) {
      console.error("Failed to submit:", error);
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    const props = {
      step: currentStep,
      answers,
      onChange: handleAnswer,
      onValidityChange: setIsStepValid,
      onAutoAdvance: handleAutoAdvance,
    };

    switch (currentStep.id) {
      case "contact":
        return <ContactStep {...props} />;
      case "contact_to_send_results":
        return <ContactStep {...props} />;
      case "employees_count":
        return <EmployeesCountStep {...props} />;
      case "days_per_week":
        return <DaysPerWeekStep {...props} />;
      case "delivery_time":
        return <DeliveryTimeStep {...props} />;
      case "budget_per_person":
        return <BudgetStep {...props} />;
      case "free_tasting_interest":
        return <TastingStep {...props} />;
      case "promo_offers_opt_in":
        return <PromoOffersStep {...props} />;
      default:
        return null;
    }
  };

  const slideVariants = {
    enter: (direction: string) => ({
      x: direction === "forward" ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: string) => ({
      x: direction === "forward" ? -100 : 100,
      opacity: 0,
    }),
  };

  return (
    <>
      <AnimatedBackground />
      <GlobalNav showDashboardLink />
      
      <div className="container mx-auto px-4 py-8 sm:py-12 max-w-full overflow-x-hidden">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Hero section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold">
              <span className="text-gradient">Plan Your</span>
              <br />
              Office Lunch Budget
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get a customized lunch plan in minutes. Simple, fast, and tailored to your team.
            </p>
          </motion.div>

          {/* Stepper Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <StepperProgress
              steps={stepLabels}
              currentStep={currentStepIndex}
            />
          </motion.div>

          {/* Main Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlassCard hover={false} className="overflow-hidden">
              <GlassCardHeader>
                <GlassCardTitle className="text-3xl">
                  {currentStep.title}
                </GlassCardTitle>
                {currentStep.description && (
                  <GlassCardDescription className="text-base">
                    {currentStep.description}
                  </GlassCardDescription>
                )}
              </GlassCardHeader>
              
              <GlassCardContent className="space-y-8 min-h-[400px]">
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={currentStepIndex}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                  >
                    {renderStep()}
                  </motion.div>
                </AnimatePresence>

                {/* Navigation */}
                <div className="flex items-center justify-between gap-4 pt-6 border-t border-border/50">
                  <MotionButton
                    variant="outline"
                    size="lg"
                    onClick={handleBack}
                    disabled={currentStepIndex === 0}
                    className="gap-2"
                  >
                    <ChevronLeft className="h-5 w-5" />
                    Back
                  </MotionButton>

                  <div className="text-sm text-muted-foreground font-medium">
                    Step {currentStepIndex + 1} of {enabledSteps.length}
                  </div>

                  <MotionButton
                    variant="primary"
                    size="lg"
                    onClick={handleNext}
                    disabled={!isStepValid || isSubmitting}
                    loading={isSubmitting}
                    shimmer
                    glow
                    className="gap-2"
                  >
                    {isLastStep ? "Get Results" : "Next"}
                    {!isLastStep && <ChevronRight className="h-5 w-5" />}
                  </MotionButton>
                </div>
              </GlassCardContent>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </>
  );
}
