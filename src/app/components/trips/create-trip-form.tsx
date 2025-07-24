"use client";

import { useState } from "react";
import { z } from "zod";
import { createTripSchema } from "@/app/lib/validation/trips";
import { TripFormFields } from "./trip-form-fields";
import { createTripAction } from "@/app/trips/actions";

type FormData = z.infer<typeof createTripSchema>;

export function CreateTripForm({ userId }: { userId: string }) {
  const [form, setForm] = useState<FormData>({
    name: "",
    destination: "",
    startDate: "",
    endDate: "",
    notes: "",
  });
  const [error, setError] = useState<string | null>(null);

  function updateField(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const validatedFormData = createTripSchema.parse(form);
      createTripAction(userId, {
        ...validatedFormData,
        startDate: new Date(validatedFormData.startDate),
        endDate: new Date(validatedFormData.endDate),
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.issues[0]?.message || "Invalid form data.");
      } else {
        setError("Something went wrong. Try again.");
      }
    }
  }

  return (
    <TripFormFields
      form={form}
      updateField={updateField}
      handleSubmit={handleSubmit}
      error={error}
      buttonLabel="Create Trip"
    />
  );
}
