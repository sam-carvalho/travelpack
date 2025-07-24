"use client";

import { useState } from "react";
import { addPackingItemAction } from "@/app/trips/[id]/packing-lists/actions";
import { Category, Option } from "@/app/lib/types";
import { CategorySelect } from "./category-select";

export function MobilePackingForm({
  userId,
  tripId,
  packingListId,
  categories = [],
  onAfterSubmit,
}: {
  userId: string;
  tripId: string;
  packingListId: string;
  categories?: Category[];
  onAfterSubmit?: () => void;
}) {
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [categoryId, setCategoryId] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Option | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await addPackingItemAction(tripId, packingListId, {
      name: itemName,
      quantity,
      categoryId,
    });

    setItemName("");
    setQuantity(1);
    setCategoryId("");
    setSelectedCategory(null);
    onAfterSubmit?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 px-5">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Item Name
        </label>
        <input
          type="text"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          required
          className="mt-1 w-full rounded border border-gray-300 p-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Quantity
        </label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          min={1}
          required
          className="mt-1 w-full rounded border border-gray-300 p-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <CategorySelect
          userId={userId}
          categories={categories}
          tripId={tripId}
          packingListId={packingListId}
          value={selectedCategory}
          onChange={(option) => {
            setSelectedCategory(option);
            setCategoryId(option?.value ?? "");
          }}
        />
      </div>

      <button
        type="submit"
        className="w-full cursor-pointer rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        Add Item
      </button>
    </form>
  );
}
