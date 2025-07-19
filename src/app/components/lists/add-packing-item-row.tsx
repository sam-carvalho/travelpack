"use client";

import { addPackingItemAction } from "@/app/trips/[id]/packing-lists/actions";
import { useState } from "react";
import { CategorySelect } from "./category-select";
import { Category, Option } from "@/app/lib/types";

type AddPackingItemRowProps = {
  userId: string;
  tripId: string;
  packingListId: string;
  categories?: Category[];
  onAfterSubmit?: () => void;
};

export function AddPackingItemRow({
  userId,
  tripId,
  packingListId,
  categories,
  onAfterSubmit,
}: AddPackingItemRowProps) {
  const [form, setForm] = useState({
    name: "",
    quantity: 1,
    categoryId: "",
  });

  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await addPackingItemAction(tripId, packingListId, {
        name: form.name,
        quantity: Number(form.quantity),
        categoryId: form.categoryId,
      });
      setForm({ name: "", quantity: 1, categoryId: "" });
      setSelectedCategory(null);
      if (onAfterSubmit) {
        onAfterSubmit();
      }
    } catch (error) {
      console.error("Error adding item:", error);
    } finally {
      setSubmitting(false);
    }
  }

  const [selectedCategory, setSelectedCategory] = useState<Option | null>(null);

  return (
    <>
      <td className="px-2 py-4" />
      <td className="px-2 py-4">
        <input
          autoFocus
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full rounded-md border border-gray-300 px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="Item name"
          required
        />
      </td>
      <td className="px-2 py-4">
        <input
          type="number"
          value={form.quantity}
          min={1}
          onChange={(e) =>
            setForm({ ...form, quantity: Number(e.target.value) })
          }
          className="w-full rounded-md border border-gray-300 px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </td>
      <td className="w-2xs px-2 py-1">
        <CategorySelect
          userId={userId}
          categories={categories}
          tripId={tripId}
          packingListId={packingListId}
          value={selectedCategory}
          onChange={(option) => {
            setSelectedCategory(option);
            setForm({ ...form, categoryId: option?.value ?? "" });
          }}
        />
      </td>
      <td className="p-4">
        <button
          onClick={handleSubmit}
          className="rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-700 disabled:opacity-50"
          disabled={!form.name || !form.quantity || submitting}
        >
          {submitting ? "..." : "Add"}
        </button>
      </td>
    </>
  );
}
