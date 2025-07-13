"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createTripSchema } from "@/app/lib/validation/trips";
import { z } from "zod";

type FormData = z.infer<typeof createTripSchema>;

export function TripForm() {
  const [form, setForm] = useState<FormData>({
    name: "",
    destination: "",
    startDate: "",
    endDate: "",
    notes: "",
  });

  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const result = createTripSchema.safeParse(form);
    if (!result.success) {
      setError(result.error.issues[0]?.message || "Invalid form data.");
      return;
    }

    const res = await fetch("/api/trips", {
      method: "POST",
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Something went wrong.");
      return;
    }

    const { id } = await res.json();
    router.push(`/trips/${id}`);
  }

  function updateField(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <form
      onSubmit={handleSubmit}
      aria-describedby="form-error"
      className="mx-12 md:mx-auto mb-20 max-w-xl rounded-xl bg-white p-8 shadow-lg border border-gray-200"
    >
      <div className="mb-4">
        <label
          htmlFor="tripName"
          className="block text-sm font-medium text-gray-700"
        >
          Trip Name
        </label>
        <input
          id="tripName"
          name="name"
          type="text"
          required
          aria-required="true"
          aria-invalid={!!error}
          className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none"
          placeholder="e.g. Japan 2025"
          value={form.name}
          onChange={(e) => updateField("name", e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="destination"
          className="block text-sm font-medium text-gray-700"
        >
          Destination
        </label>
        <input
          id="destination"
          name="destination"
          type="text"
          required
          aria-required="true"
          aria-invalid={!!error}
          className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none"
          placeholder="e.g. Kyoto"
          value={form.destination}
          onChange={(e) => updateField("destination", e.target.value)}
        />
      </div>

      <div className="mb-4 flex flex-col sm:flex-row gap-4">
        <div className="w-full">
          <label
            htmlFor="startDate"
            className="block text-sm font-medium text-gray-700"
          >
            Start Date
          </label>
          <input
            id="startDate"
            name="startDate"
            type="date"
            required
            aria-required="true"
            aria-invalid={!!error}
            className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none"
            value={form.startDate}
            onChange={(e) => updateField("startDate", e.target.value)}
          />
        </div>
        <div className="w-full">
          <label
            htmlFor="endDate"
            className="block text-sm font-medium text-gray-700"
          >
            End Date
          </label>
          <input
            id="endDate"
            name="endDate"
            type="date"
            required
            aria-required="true"
            aria-invalid={!!error}
            className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none"
            value={form.endDate}
            onChange={(e) => updateField("endDate", e.target.value)}
          />
        </div>
      </div>

      <div className="mb-6">
        <label
          htmlFor="notes"
          className="block text-sm font-medium text-gray-700"
        >
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={4}
          aria-invalid={!!error}
          className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none"
          placeholder="e.g. Bring travel adapter"
          value={form.notes}
          onChange={(e) => updateField("notes", e.target.value)}
        />
      </div>

      {error && (
        <p id="form-error" className="mb-4 text-sm text-red-600">
          {error}
        </p>
      )}

      <button
        type="submit"
        className="w-full rounded-md px-6 py-3 text-center text-white font-medium shadow bg-gradient-to-r from-amber-500 to-pink-500 hover:to-pink-800 transition-all duration-300"
      >
        Create Trip
      </button>
    </form>
  );
}
