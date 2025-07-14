"use client";

import { useState } from "react";
import { z } from "zod";
import { updateTripSchema } from "@/app/lib/validation/trips";
import { Trip } from "@/app/lib/types";
import { TripFormFields } from "./trip-form-fields";
import { updateTripAction } from "@/app/trips/actions";

type FormData = z.infer<typeof updateTripSchema>;

export function EditTripForm({ userId, trip }: { userId: string; trip: Trip }) {
  const [form, setForm] = useState<FormData>({
    name: trip.name || "",
    destination: trip.destination || "",
    startDate: trip.startDate || "",
    endDate: trip.endDate || "",
    notes: trip.notes || "",
  });
  const [error, setError] = useState<string | null>(null);

  function updateField(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const validatedFormData = updateTripSchema.parse(form);
      updateTripAction(userId, trip.id, {
        ...validatedFormData,
        startDate: validatedFormData.startDate
          ? new Date(validatedFormData.startDate)
          : undefined,
        endDate: validatedFormData.endDate
          ? new Date(validatedFormData.endDate)
          : undefined,
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
      buttonLabel="Save Changes"
    />
  );
}
