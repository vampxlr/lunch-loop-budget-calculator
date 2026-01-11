"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DashboardLayout } from "@/components/DashboardLayout";
import { loadSchema, saveSchema } from "@/lib/storage";
import { resolveSchemaSource } from "@/lib/config";
import { PlannerSchema } from "@/types/schema";
import { Loader2, Save, RefreshCw } from "lucide-react";

export default function PlannerEditorPage() {
  const [schema, setSchema] = useState<PlannerSchema | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const schemaSource = resolveSchemaSource();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await loadSchema();
      setSchema(data);
    } catch (error) {
      console.error("Failed to load schema:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!schema) return;

    setIsSaving(true);
    setSaveMessage("");

    try {
      await saveSchema(schema);
      setSaveMessage(
        schemaSource === "db"
          ? "Schema saved to database successfully!"
          : "Schema saved to localStorage successfully!"
      );
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (error) {
      console.error("Failed to save schema:", error);
      setSaveMessage("Failed to save schema. Check console for details.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    if (confirm("Are you sure you want to reload the schema? Any unsaved changes will be lost.")) {
      setIsLoading(true);
      await loadData();
    }
  };

  const updatePricing = (field: string, value: any) => {
    if (!schema) return;
    setSchema({
      ...schema,
      pricing: {
        ...schema.pricing,
        [field]: value,
      },
    });
  };

  const updateEmployeesField = (field: string, value: any) => {
    if (!schema) return;
    const stepIndex = schema.steps.findIndex((s) => s.id === "employees_count");
    if (stepIndex === -1) return;

    const updatedSteps = [...schema.steps];
    const fieldIndex = updatedSteps[stepIndex].fields.findIndex(
      (f) => f.name === "employees_count"
    );
    if (fieldIndex === -1) return;

    updatedSteps[stepIndex].fields[fieldIndex] = {
      ...updatedSteps[stepIndex].fields[fieldIndex],
      [field]: value,
    };

    setSchema({ ...schema, steps: updatedSteps });
  };

  const updateDeliveryTimeDefault = (value: string) => {
    if (!schema) return;
    const stepIndex = schema.steps.findIndex((s) => s.id === "delivery_time");
    if (stepIndex === -1) return;

    const updatedSteps = [...schema.steps];
    const fieldIndex = updatedSteps[stepIndex].fields.findIndex(
      (f) => f.name === "delivery_time"
    );
    if (fieldIndex === -1) return;

    updatedSteps[stepIndex].fields[fieldIndex] = {
      ...updatedSteps[stepIndex].fields[fieldIndex],
      default: value,
    };

    setSchema({ ...schema, steps: updatedSteps });
  };

  const toggleStep = (stepId: string) => {
    if (!schema) return;
    const updatedSteps = schema.steps.map((step) =>
      step.id === stepId ? { ...step, enabled: !step.enabled } : step
    );
    setSchema({ ...schema, steps: updatedSteps });
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

  if (!schema) {
    return (
      <DashboardLayout>
        <Card>
          <CardHeader>
            <CardTitle>Schema Not Found</CardTitle>
            <CardDescription>Failed to load planner schema.</CardDescription>
          </CardHeader>
        </Card>
      </DashboardLayout>
    );
  }

  const employeesStep = schema.steps.find((s) => s.id === "employees_count");
  const employeesField = employeesStep?.fields.find(
    (f) => f.name === "employees_count"
  );

  const deliveryTimeStep = schema.steps.find((s) => s.id === "delivery_time");
  const deliveryTimeField = deliveryTimeStep?.fields.find(
    (f) => f.name === "delivery_time"
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Planner Editor</h1>
            <p className="text-muted-foreground">
              Configure planner schema and pricing
              {schemaSource === "db" && " (Using Database)"}
              {schemaSource === "file" && " (Using localStorage)"}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleReset}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Reset
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>

        {saveMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-lg ${
              saveMessage.includes("success")
                ? "bg-green-500/10 text-green-500"
                : "bg-destructive/10 text-destructive"
            }`}
          >
            {saveMessage}
          </motion.div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Step Configuration</CardTitle>
            <CardDescription>Enable or disable wizard steps</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {schema.steps.map((step) => (
                <div
                  key={step.id}
                  className="flex items-center justify-between p-4 rounded-lg border"
                >
                  <div>
                    <div className="font-semibold">{step.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {step.description}
                    </div>
                  </div>
                  <Button
                    variant={step.enabled ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleStep(step.id)}
                  >
                    {step.enabled ? "Enabled" : "Disabled"}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Employees Range</CardTitle>
            <CardDescription>
              Configure the employee count slider range
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="emp-min">Minimum</Label>
                <Input
                  id="emp-min"
                  type="number"
                  value={employeesField?.min ?? 5}
                  onChange={(e) =>
                    updateEmployeesField("min", parseInt(e.target.value))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emp-max">Maximum</Label>
                <Input
                  id="emp-max"
                  type="number"
                  value={employeesField?.max ?? 500}
                  onChange={(e) =>
                    updateEmployeesField("max", parseInt(e.target.value))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emp-step">Step</Label>
                <Input
                  id="emp-step"
                  type="number"
                  value={employeesField?.step ?? 1}
                  onChange={(e) =>
                    updateEmployeesField("step", parseInt(e.target.value))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emp-default">Default</Label>
                <Input
                  id="emp-default"
                  type="number"
                  value={employeesField?.default ?? 30}
                  onChange={(e) =>
                    updateEmployeesField("default", parseInt(e.target.value))
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Delivery Time Default</CardTitle>
            <CardDescription>
              Set the default delivery time (24-hour format HH:MM)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-w-xs">
              <Label htmlFor="delivery-default">Default Time</Label>
              <Input
                id="delivery-default"
                type="text"
                placeholder="12:30"
                value={deliveryTimeField?.default ?? "12:30"}
                onChange={(e) => updateDeliveryTimeDefault(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Format: HH:MM (e.g., 12:30, 13:00)
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pricing Configuration</CardTitle>
            <CardDescription>
              Configure budget presets and delivery modifiers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3">Budget Presets</h3>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="basic">Basic (৳)</Label>
                    <Input
                      id="basic"
                      type="number"
                      value={schema.pricing.basic_budget}
                      onChange={(e) =>
                        updatePricing("basic_budget", parseFloat(e.target.value))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="standard">Standard (৳)</Label>
                    <Input
                      id="standard"
                      type="number"
                      value={schema.pricing.standard_budget}
                      onChange={(e) =>
                        updatePricing(
                          "standard_budget",
                          parseFloat(e.target.value)
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="premium">Premium (৳)</Label>
                    <Input
                      id="premium"
                      type="number"
                      value={schema.pricing.premium_budget}
                      onChange={(e) =>
                        updatePricing("premium_budget", parseFloat(e.target.value))
                      }
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Peak Time Window</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="peak-start">Peak Start (HH:MM)</Label>
                    <Input
                      id="peak-start"
                      type="text"
                      placeholder="11:00"
                      value={schema.pricing.peak_start}
                      onChange={(e) => updatePricing("peak_start", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="peak-end">Peak End (HH:MM)</Label>
                    <Input
                      id="peak-end"
                      type="text"
                      placeholder="13:30"
                      value={schema.pricing.peak_end}
                      onChange={(e) => updatePricing("peak_end", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Off-Peak Modifier</h3>
                <div className="max-w-xs">
                  <Label htmlFor="offpeak">Additional Cost (৳)</Label>
                  <Input
                    id="offpeak"
                    type="number"
                    value={schema.pricing.offpeak_modifier}
                    onChange={(e) =>
                      updatePricing("offpeak_modifier", parseFloat(e.target.value))
                    }
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Extra charge for deliveries outside peak hours
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
