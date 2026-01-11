"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/DashboardLayout";
import { getSubmission, getEventsForSubmission } from "@/lib/storage";
import { resendWebhook } from "@/lib/webhook";
import { Submission, Event } from "@/types/submission";
import { formatCurrency, formatDate, formatTime } from "@/lib/utils";
import {
  Loader2,
  Mail,
  Phone,
  Users,
  Calendar,
  Clock,
  DollarSign,
  RefreshCw,
  CheckCircle2,
  XCircle,
  MinusCircle,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

export default function SubmissionDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [submission, setSubmission] = useState<Submission | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const [sub, evts] = await Promise.all([
        getSubmission(id),
        getEventsForSubmission(id),
      ]);
      setSubmission(sub);
      setEvents(evts);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendWebhook = async () => {
    if (!submission) return;

    setIsResending(true);
    try {
      await resendWebhook(submission);
      await loadData(); // Reload to get updated events
    } catch (error) {
      console.error("Failed to resend webhook:", error);
      alert("Failed to resend webhook. Check console for details.");
    } finally {
      setIsResending(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (!submission) {
    return (
      <DashboardLayout>
        <Card>
          <CardHeader>
            <CardTitle>Submission Not Found</CardTitle>
            <CardDescription>
              The submission you're looking for doesn't exist.
            </CardDescription>
          </CardHeader>
        </Card>
      </DashboardLayout>
    );
  }

  const getEventIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "failed":
        return <XCircle className="h-5 w-5 text-destructive" />;
      case "skipped":
        return <MinusCircle className="h-5 w-5 text-muted-foreground" />;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Submission Details
            </h1>
            <p className="text-muted-foreground">
              {formatDate(submission.created_at)}
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Email</div>
                  <div className="font-medium">{submission.email}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Phone</div>
                  <div className="font-medium">{submission.phone}</div>
                </div>
              </div>
              {submission.company_name && (
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">Company</div>
                    <div className="font-medium">{submission.company_name}</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Employees</div>
                  <div className="font-medium">
                    {submission.answers_json.employees_count}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">
                    Days per Week
                  </div>
                  <div className="font-medium">
                    {submission.answers_json.days_per_week}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">
                    Delivery Time
                  </div>
                  <div className="font-medium">
                    {formatTime(submission.answers_json.delivery_time)}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <DollarSign className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">
                    Budget per Person
                  </div>
                  <div className="font-medium">
                    {formatCurrency(submission.answers_json.budget_per_person)}
                    {submission.answers_json.budget_type && (
                      <span className="ml-2 text-sm text-muted-foreground">
                        ({submission.answers_json.budget_type})
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Cost Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="p-4 rounded-lg bg-primary/10">
                <div className="text-sm text-muted-foreground">
                  Cost per Person
                </div>
                <div className="text-2xl font-bold text-primary">
                  {formatCurrency(submission.cost_per_person)}
                </div>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <div className="text-sm text-muted-foreground">Daily Cost</div>
                <div className="text-2xl font-bold">
                  {formatCurrency(submission.daily_cost)}
                </div>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <div className="text-sm text-muted-foreground">Weekly Cost</div>
                <div className="text-2xl font-bold">
                  {formatCurrency(submission.weekly_cost)}
                </div>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <div className="text-sm text-muted-foreground">Monthly Cost</div>
                <div className="text-2xl font-bold">
                  {formatCurrency(submission.monthly_cost)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Event Timeline</CardTitle>
              <CardDescription>
                History of all events for this submission
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleResendWebhook}
              disabled={isResending}
            >
              {isResending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Resending...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Resend Webhook
                </>
              )}
            </Button>
          </CardHeader>
          <CardContent>
            {events.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No events recorded yet
              </div>
            ) : (
              <div className="space-y-3">
                {events.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-start gap-3 p-4 rounded-lg border"
                  >
                    {getEventIcon(event.status)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <div className="font-semibold">{event.event_type}</div>
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                            event.status === "success"
                              ? "bg-green-500/10 text-green-500"
                              : event.status === "failed"
                              ? "bg-destructive/10 text-destructive"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {event.status}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Source: {event.source}
                      </div>
                      {event.message && (
                        <div className="text-sm mt-1">{event.message}</div>
                      )}
                      <div className="text-xs text-muted-foreground mt-1">
                        {formatDate(event.created_at)}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {submission.free_tasting_interest && (
          <Card>
            <CardHeader>
              <CardTitle>Free Tasting Interest</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-green-500">
                <CheckCircle2 className="h-5 w-5" />
                <span className="font-medium">
                  Customer is interested in a free tasting session
                </span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
