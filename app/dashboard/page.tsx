"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  GlassCard,
  GlassCardHeader,
  GlassCardTitle,
  GlassCardDescription,
  GlassCardContent,
} from "@/components/ui/glass-card";
import { MotionButton } from "@/components/ui/motion-button";
import { Input } from "@/components/ui/input";
import { DashboardLayout } from "@/components/DashboardLayout";
import { getAllSubmissions } from "@/lib/storage";
import { Submission } from "@/types/submission";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Loader2, Search, Eye, TrendingUp, Users, Calendar, DollarSign, FileText } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadSubmissions();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = submissions.filter(
        (sub) =>
          sub.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          sub.phone?.includes(searchTerm) ||
          (sub.company_name &&
            sub.company_name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredSubmissions(filtered);
    } else {
      setFilteredSubmissions(submissions);
    }
  }, [searchTerm, submissions]);

  const loadSubmissions = async () => {
    try {
      const data = await getAllSubmissions();
      setSubmissions(data);
      setFilteredSubmissions(data);
    } catch (error) {
      console.error("Failed to load submissions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const stats = {
    total: submissions.length,
    totalRevenue: submissions.reduce((sum, sub) => sum + sub.monthly_cost, 0),
    avgEmployees: submissions.length > 0
      ? Math.round(
          submissions.reduce((sum, sub) => sum + sub.answers_json.employees_count, 0) /
            submissions.length
        )
      : 0,
    tastingInterest: submissions.filter((sub) => sub.free_tasting_interest).length,
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-full overflow-x-hidden">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold mb-2">
            <span className="text-gradient">Dashboard</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Overview of all submissions and analytics
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <GlassCard hover glow className="group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
              <GlassCardContent className="relative p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Total Submissions
                  </span>
                </div>
                <div className="text-4xl sm:text-5xl font-bold text-gradient break-words">
                  {stats.total}
                </div>
                <div className="mt-3 text-xs text-muted-foreground">
                  All time submissions
                </div>
              </GlassCardContent>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlassCard hover className="group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-secondary/5 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
              <GlassCardContent className="relative p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <DollarSign className="h-6 w-6 text-secondary" />
                  </div>
                  <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Monthly Revenue
                  </span>
                </div>
                <div className="text-3xl sm:text-4xl font-bold break-words leading-tight">
                  {formatCurrency(stats.totalRevenue)}
                </div>
                <div className="mt-3 text-xs text-muted-foreground">
                  Estimated total revenue
                </div>
              </GlassCardContent>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <GlassCard hover className="group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
              <GlassCardContent className="relative p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Users className="h-6 w-6 text-blue-500" />
                  </div>
                  <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Avg. Employees
                  </span>
                </div>
                <div className="text-4xl sm:text-5xl font-bold break-words">
                  {stats.avgEmployees}
                </div>
                <div className="mt-3 text-xs text-muted-foreground">
                  Average team size
                </div>
              </GlassCardContent>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <GlassCard hover className="group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-green-500/5 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
              <GlassCardContent className="relative p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <TrendingUp className="h-6 w-6 text-green-500" />
                  </div>
                  <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Tasting Interest
                  </span>
                </div>
                <div className="text-4xl sm:text-5xl font-bold break-words">
                  {stats.tastingInterest}
                </div>
                <div className="mt-3 text-xs text-muted-foreground">
                  {stats.total > 0
                    ? Math.round((stats.tastingInterest / stats.total) * 100)
                    : 0}
                  % of total submissions
                </div>
              </GlassCardContent>
            </GlassCard>
          </motion.div>
        </div>

        {/* Submissions List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <GlassCard>
            <GlassCardHeader>
              <GlassCardTitle className="text-2xl">Submissions</GlassCardTitle>
              <GlassCardDescription className="text-base">
                All budget planner submissions from customers
              </GlassCardDescription>
              <div className="flex items-center gap-2 pt-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Search by email, phone, or company..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-11 h-12 glass border-2 border-border/50 focus:border-primary"
                  />
                </div>
              </div>
            </GlassCardHeader>
            <GlassCardContent>
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                  <p className="text-muted-foreground">Loading submissions...</p>
                </div>
              ) : filteredSubmissions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-16 h-16 rounded-full glass flex items-center justify-center mb-4">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-lg font-medium text-muted-foreground">
                    {searchTerm
                      ? "No submissions found"
                      : "No submissions yet"}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {searchTerm
                      ? "Try adjusting your search"
                      : "Submissions will appear here once customers complete the planner"}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredSubmissions.map((submission, index) => (
                    <motion.div
                      key={submission.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-5 rounded-xl glass border border-border/30 hover:border-primary/50 transition-all group"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="font-bold text-lg truncate group-hover:text-primary transition-colors">
                            {submission.email}
                          </div>
                          {submission.free_tasting_interest && (
                            <motion.span
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="inline-flex items-center rounded-full bg-success/20 px-3 py-1 text-xs font-semibold text-success border border-success/30"
                            >
                              🍽️ Tasting
                            </motion.span>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {submission.phone}
                          {submission.company_name &&
                            ` • ${submission.company_name}`}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground mt-2">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(submission.created_at)}
                          </span>
                          <span className="flex items-center gap-1 font-semibold text-primary">
                            <DollarSign className="h-3 w-3" />
                            {formatCurrency(submission.monthly_cost)}/month
                          </span>
                        </div>
                      </div>
                      <MotionButton
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          router.push(`/dashboard/submissions/${submission.id}`)
                        }
                        className="gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        <span className="hidden sm:inline">View</span>
                      </MotionButton>
                    </motion.div>
                  ))}
                </div>
              )}
            </GlassCardContent>
          </GlassCard>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
