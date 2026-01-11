"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { AuroraBackground } from "@/components/blocks/AuroraBackground";
import { GlobalNav } from "@/components/blocks/GlobalNav";
import {
  GlassCard,
  GlassCardHeader,
  GlassCardTitle,
  GlassCardDescription,
  GlassCardContent,
} from "@/components/ui/glass-card";
import { MotionButton } from "@/components/ui/motion-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  getSubmission,
  updateSubmission,
  loadSchema,
  logEvent,
} from "@/lib/storage";
import { calculateCosts } from "@/lib/pricing";
import { getContactPhone } from "@/lib/config";
import { Submission } from "@/types/submission";
import { PlannerSchema } from "@/types/schema";
import {
  formatCurrency,
  formatTime,
  time24to12,
  time12to24,
} from "@/lib/utils";
import {
  Loader2,
  Edit2,
  Save,
  X,
  Check,
  Phone,
  Mail,
  Users,
  Calendar,
  Clock,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ResultsPage() {
  const params = useParams();
  const id = params.id as string;

  const [submission, setSubmission] = useState<Submission | null>(null);
  const [schema, setSchema] = useState<PlannerSchema | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Record<string, any>>({});
  const contactPhone = getContactPhone();

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const [sub, sch] = await Promise.all([getSubmission(id), loadSchema()]);
      setSubmission(sub);
      setSchema(sch);
      if (sub) {
        setEditValues(sub.answers_json);
      }
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (field: string) => {
    setEditingField(field);
  };

  const handleCancelEdit = () => {
    setEditingField(null);
    if (submission) {
      setEditValues(submission.answers_json);
    }
  };

  const handleSaveEdit = async (field: string) => {
    if (!submission || !schema) return;

    try {
      const updatedAnswers = { ...submission.answers_json, ...editValues };
      const costs = calculateCosts(updatedAnswers, schema.pricing);

      const updates = {
        answers_json: updatedAnswers,
        email: updatedAnswers.email,
        phone: updatedAnswers.phone,
        company_name: updatedAnswers.company_name,
        free_tasting_interest: updatedAnswers.free_tasting_interest,
        promo_opt_in: updatedAnswers.promo_opt_in,
        cost_per_person: costs.cost_per_person,
        daily_cost: costs.daily_cost,
        weekly_cost: costs.weekly_cost,
        monthly_cost: costs.monthly_cost,
      };

      await updateSubmission(id, updates);
      await logEvent(id, "pricing.calculated", "results", "success", undefined, costs);

      setSubmission({ ...submission, ...updates });
      setEditingField(null);
    } catch (error) {
      console.error("Failed to save edit:", error);
    }
  };

  if (isLoading) {
    return (
      <AuroraBackground>
        <div className="min-h-screen flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-strong p-8 rounded-2xl"
          >
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
            <p className="text-center mt-4 text-muted-foreground">Loading your results...</p>
          </motion.div>
        </div>
      </AuroraBackground>
    );
  }

  if (!submission || !schema) {
    return (
      <AuroraBackground>
        <GlobalNav showDashboardLink />
        <div className="min-h-screen flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <GlassCard className="max-w-md">
              <GlassCardHeader>
                <GlassCardTitle>Submission Not Found</GlassCardTitle>
                <GlassCardDescription>
                  The submission you're looking for doesn't exist.
                </GlassCardDescription>
              </GlassCardHeader>
            </GlassCard>
          </motion.div>
        </div>
      </AuroraBackground>
    );
  }

  const renderEditableField = (
    field: string,
    label: string,
    value: any,
    type: "text" | "number" | "time" | "boolean" = "text",
    icon?: React.ReactNode
  ) => {
    const isEditing = editingField === field;

    if (type === "boolean") {
      return (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start justify-between p-4 rounded-xl glass border border-border/30"
        >
          <div className="flex items-center gap-3">
            {icon}
            <div>
              <div className="text-sm text-muted-foreground font-medium">{label}</div>
              <div className="font-bold text-lg mt-1">
                {value ? (
                  <span className="text-success">Yes ✓</span>
                ) : (
                  <span className="text-muted-foreground">No</span>
                )}
              </div>
            </div>
          </div>
          {!isEditing ? (
            <MotionButton
              variant="ghost"
              size="sm"
              onClick={() => handleEdit(field)}
            >
              <Edit2 className="h-4 w-4" />
            </MotionButton>
          ) : (
            <div className="flex gap-2">
              <MotionButton
                variant="ghost"
                size="sm"
                onClick={() => {
                  setEditValues((prev) => ({
                    ...prev,
                    [field]: true,
                  }));
                  handleSaveEdit(field);
                }}
              >
                <Check className="h-4 w-4 text-success" />
              </MotionButton>
              <MotionButton
                variant="ghost"
                size="sm"
                onClick={() => {
                  setEditValues((prev) => ({
                    ...prev,
                    [field]: false,
                  }));
                  handleSaveEdit(field);
                }}
              >
                <X className="h-4 w-4 text-danger" />
              </MotionButton>
            </div>
          )}
        </motion.div>
      );
    }

    if (type === "time") {
      const { hour, minute, period } = time24to12(value);

      return (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start justify-between p-4 rounded-xl glass border border-border/30"
        >
          <div className="flex items-center gap-3 flex-1">
            {icon}
            <div className="flex-1">
              <div className="text-sm text-muted-foreground font-medium">{label}</div>
              {!isEditing ? (
                <div className="font-bold text-lg mt-1">{formatTime(value)}</div>
              ) : (
                <div className="flex gap-2 mt-2">
                  <Input
                    type="number"
                    min="1"
                    max="12"
                    value={time24to12(editValues[field] || value).hour}
                    onChange={(e) => {
                      const newHour = parseInt(e.target.value);
                      const current = time24to12(editValues[field] || value);
                      setEditValues((prev) => ({
                        ...prev,
                        [field]: time12to24(newHour, current.minute, current.period),
                      }));
                    }}
                    className="w-16 glass"
                  />
                  <Input
                    type="number"
                    min="0"
                    max="59"
                    step="15"
                    value={time24to12(editValues[field] || value).minute}
                    onChange={(e) => {
                      const newMinute = parseInt(e.target.value);
                      const current = time24to12(editValues[field] || value);
                      setEditValues((prev) => ({
                        ...prev,
                        [field]: time12to24(current.hour, newMinute, current.period),
                      }));
                    }}
                    className="w-16 glass"
                  />
                  <select
                    value={time24to12(editValues[field] || value).period}
                    onChange={(e) => {
                      const newPeriod = e.target.value as "AM" | "PM";
                      const current = time24to12(editValues[field] || value);
                      setEditValues((prev) => ({
                        ...prev,
                        [field]: time12to24(current.hour, current.minute, newPeriod),
                      }));
                    }}
                    className="w-16 h-10 rounded-lg glass border border-border px-2"
                  >
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </div>
              )}
            </div>
          </div>
          {!isEditing ? (
            <MotionButton
              variant="ghost"
              size="sm"
              onClick={() => handleEdit(field)}
            >
              <Edit2 className="h-4 w-4" />
            </MotionButton>
          ) : (
            <div className="flex gap-2">
              <MotionButton
                variant="ghost"
                size="sm"
                onClick={() => handleSaveEdit(field)}
              >
                <Save className="h-4 w-4 text-success" />
              </MotionButton>
              <MotionButton
                variant="ghost"
                size="sm"
                onClick={handleCancelEdit}
              >
                <X className="h-4 w-4 text-danger" />
              </MotionButton>
            </div>
          )}
        </motion.div>
      );
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between p-4 rounded-xl glass border border-border/30"
      >
        <div className="flex items-center gap-3 flex-1">
          {icon}
          <div className="flex-1">
            <div className="text-sm text-muted-foreground font-medium">{label}</div>
            {!isEditing ? (
              <div className="font-bold text-lg mt-1">{value}</div>
            ) : (
              <Input
                type={type}
                value={editValues[field] ?? value}
                onChange={(e) =>
                  setEditValues((prev) => ({
                    ...prev,
                    [field]:
                      type === "number"
                        ? parseFloat(e.target.value)
                        : e.target.value,
                  }))
                }
                className="mt-2 glass"
              />
            )}
          </div>
        </div>
        {!isEditing ? (
          <MotionButton variant="ghost" size="sm" onClick={() => handleEdit(field)}>
            <Edit2 className="h-4 w-4" />
          </MotionButton>
        ) : (
          <div className="flex gap-2">
            <MotionButton
              variant="ghost"
              size="sm"
              onClick={() => handleSaveEdit(field)}
            >
              <Save className="h-4 w-4 text-success" />
            </MotionButton>
            <MotionButton
              variant="ghost"
              size="sm"
              onClick={handleCancelEdit}
            >
              <X className="h-4 w-4 text-danger" />
            </MotionButton>
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <AuroraBackground>
      <GlobalNav showDashboardLink />
      
      <div className="container mx-auto px-4 py-4 sm:py-12 max-w-full overflow-x-hidden">
        <div className="max-w-5xl mx-auto space-y-4 sm:space-y-8">
          {/* Hero section - Compact on mobile */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="text-center space-y-2 sm:space-y-4"
          >
            <h1 className="text-3xl sm:text-5xl font-bold">
              <span className="text-gradient">Your Custom</span>
              <br className="hidden sm:block" />
              <span className="sm:hidden"> </span>
              Lunch Budget Plan
            </h1>
            <p className="text-sm sm:text-lg text-muted-foreground max-w-2xl mx-auto hidden sm:block">
              Review your personalized plan below. You can edit any details if needed.
            </p>
          </motion.div>

          {/* Cost Breakdown - MOVED TO TOP */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <GlassCard glow>
              <GlassCardHeader className="pb-3 sm:pb-6">
                <GlassCardTitle className="text-2xl sm:text-3xl">Cost Breakdown</GlassCardTitle>
                <GlassCardDescription className="text-sm sm:text-base hidden sm:block">
                  Your estimated costs based on the provided information
                </GlassCardDescription>
              </GlassCardHeader>
              <GlassCardContent>
                <div className="grid gap-3 sm:gap-6 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.15 }}
                    className="group relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl sm:rounded-2xl blur-sm sm:blur-xl group-hover:blur-md sm:group-hover:blur-2xl transition-all" />
                    <div className="relative p-3 sm:p-6 rounded-xl sm:rounded-2xl glass border border-primary/30 sm:border-2 hover:border-primary/50 transition-all">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2 mb-2 sm:mb-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-primary/20 flex items-center justify-center">
                          <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                        </div>
                        <div className="text-xs sm:text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                          Per Person
                        </div>
                      </div>
                      <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gradient break-words">
                        {formatCurrency(submission.cost_per_person)}
                      </div>
                      <div className="mt-1 sm:mt-2 text-[10px] sm:text-xs text-muted-foreground hidden sm:block">
                        Base rate per employee
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.15, delay: 0.05 }}
                    className="group relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-xl sm:rounded-2xl blur-sm sm:blur-xl group-hover:blur-md sm:group-hover:blur-2xl transition-all" />
                    <div className="relative p-3 sm:p-6 rounded-xl sm:rounded-2xl glass border border-border/50 hover:border-blue-500/30 transition-all">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2 mb-2 sm:mb-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-blue-500/20 flex items-center justify-center">
                          <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                        </div>
                        <div className="text-xs sm:text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                          Daily
                        </div>
                      </div>
                      <div className="text-xl sm:text-2xl md:text-3xl font-bold break-words">
                        {formatCurrency(submission.daily_cost)}
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.15, delay: 0.1 }}
                    className="group relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-xl sm:rounded-2xl blur-sm sm:blur-xl group-hover:blur-md sm:group-hover:blur-2xl transition-all" />
                    <div className="relative p-3 sm:p-6 rounded-xl sm:rounded-2xl glass border border-border/50 hover:border-green-500/30 transition-all">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2 mb-2 sm:mb-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-green-500/20 flex items-center justify-center">
                          <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                        </div>
                        <div className="text-xs sm:text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                          Weekly
                        </div>
                      </div>
                      <div className="text-xl sm:text-2xl md:text-3xl font-bold break-words">
                        {formatCurrency(submission.weekly_cost)}
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.15, delay: 0.15 }}
                    className="group relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-xl sm:rounded-2xl blur-sm sm:blur-xl group-hover:blur-md sm:group-hover:blur-2xl transition-all" />
                    <div className="relative p-3 sm:p-6 rounded-xl sm:rounded-2xl glass border border-secondary/30 sm:border-2 hover:border-secondary/50 transition-all">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2 mb-2 sm:mb-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-secondary/20 flex items-center justify-center">
                          <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-secondary" />
                        </div>
                        <div className="text-xs sm:text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                          Monthly
                        </div>
                      </div>
                      <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gradient break-words">
                        {formatCurrency(submission.monthly_cost)}
                      </div>
                    </div>
                  </motion.div>
                </div>
                
                {/* Delivery Modifier Display */}
                {(() => {
                  const deliveryModifier = submission.cost_per_person - submission.answers_json.budget_per_person;
                  if (deliveryModifier > 0) {
                    return (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35 }}
                        className="mt-4 p-4 rounded-xl glass border-l-4 border-warning"
                      >
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-warning" />
                          <span className="font-semibold text-foreground">
                            Off-Peak Delivery Surcharge:
                          </span>
                          <span className="text-warning font-bold">
                            +{formatCurrency(deliveryModifier)} per person
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 ml-6">
                          Delivery outside peak hours (11:00 AM - 1:30 PM)
                        </p>
                      </motion.div>
                    );
                  }
                  return null;
                })()}
              </GlassCardContent>
            </GlassCard>
          </motion.div>

          {/* Details Cards - Collapsible on mobile */}
          <div className="grid gap-3 sm:gap-6 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              <GlassCard>
                <GlassCardHeader className="pb-3 sm:pb-6">
                  <GlassCardTitle className="text-lg sm:text-2xl">Contact Details</GlassCardTitle>
                </GlassCardHeader>
                <GlassCardContent className="space-y-3">
                  {renderEditableField(
                    "email",
                    "Email",
                    submission.answers_json.email,
                    "text",
                    <Mail className="h-5 w-5 text-muted-foreground" />
                  )}
                  {renderEditableField(
                    "phone",
                    "Phone",
                    submission.answers_json.phone,
                    "text",
                    <Phone className="h-5 w-5 text-muted-foreground" />
                  )}
                  {submission.answers_json.company_name &&
                    renderEditableField(
                      "company_name",
                      "Company",
                      submission.answers_json.company_name,
                      "text"
                    )}
                </GlassCardContent>
              </GlassCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2, delay: 0.05 }}
            >
              <GlassCard>
                <GlassCardHeader className="pb-3 sm:pb-6">
                  <GlassCardTitle className="text-lg sm:text-2xl">Order Details</GlassCardTitle>
                </GlassCardHeader>
                <GlassCardContent className="space-y-3">
                  {renderEditableField(
                    "employees_count",
                    "Employees",
                    submission.answers_json.employees_count,
                    "number",
                    <Users className="h-5 w-5 text-muted-foreground" />
                  )}
                  {renderEditableField(
                    "days_per_week",
                    "Days per Week",
                    submission.answers_json.days_per_week,
                    "number",
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                  )}
                  {renderEditableField(
                    "delivery_time",
                    "Delivery Time",
                    submission.answers_json.delivery_time,
                    "time",
                    <Clock className="h-5 w-5 text-muted-foreground" />
                  )}
                  {renderEditableField(
                    "budget_per_person",
                    "Budget per Person",
                    formatCurrency(submission.answers_json.budget_per_person),
                    "number",
                    <DollarSign className="h-5 w-5 text-muted-foreground" />
                  )}
                </GlassCardContent>
              </GlassCard>
            </motion.div>
          </div>

          {/* Additional Options - Hidden on mobile to reduce scrolling */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="hidden sm:block"
          >
            <GlassCard>
              <GlassCardHeader className="pb-3 sm:pb-6">
                <GlassCardTitle className="text-lg sm:text-2xl">Additional Options</GlassCardTitle>
              </GlassCardHeader>
              <GlassCardContent className="space-y-3">
                {renderEditableField(
                  "free_tasting_interest",
                  "Free Tasting Interest",
                  submission.answers_json.free_tasting_interest,
                  "boolean",
                  <Check className="h-5 w-5 text-muted-foreground" />
                )}
              </GlassCardContent>
            </GlassCard>
          </motion.div>

          {/* Contact Information - Compact on mobile */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <GlassCard className="relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 sm:w-64 sm:h-64 bg-gradient-to-br from-primary/10 via-secondary/5 to-transparent rounded-full blur-xl sm:blur-3xl -z-10" />
              <GlassCardContent className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-6 p-4 sm:p-8">
                <div className="flex-1 text-center sm:text-left">
                  <div className="text-lg sm:text-2xl font-bold mb-1 sm:mb-2">Questions or Ready to Start?</div>
                  <div className="text-sm sm:text-base text-muted-foreground mb-2 sm:mb-1 hidden sm:block">
                    We've sent this estimate to your email. Contact us to get started!
                  </div>
                  <div className="text-base sm:text-lg font-semibold text-primary flex items-center gap-2 mt-2 sm:mt-4 justify-center sm:justify-start">
                    <Phone className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span>{contactPhone}</span>
                  </div>
                </div>
              </GlassCardContent>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </AuroraBackground>
  );
}
