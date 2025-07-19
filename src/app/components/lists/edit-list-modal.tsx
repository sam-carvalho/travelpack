"use client";

import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useEffect, useState, useTransition } from "react";
import { PackingListItem, Category, Option } from "@/app/lib/types";
import { updatePackingItemAction } from "@/app/trips/[id]/packing-lists/actions";
import toast from "react-hot-toast";
import { CategorySelect } from "./category-select";
import { buildOptions } from "@/app/utils/formatSelectOption";

export function EditPackingItemModal({
  userId,
  tripId,
  item,
  categories,
  isOpen,
  onClose,
}: {
  userId: string;
  tripId: string;
  item: PackingListItem;
  categories?: Category[];
  isOpen: boolean;
  onClose: () => void;
}) {
  const [_, startTransition] = useTransition();
  const [name, setName] = useState(item.name);
  const [quantity, setQuantity] = useState(item.quantity);
  const [categoryId, setCategoryId] = useState(item.categoryId ?? "");
  const categoryOptions = buildOptions(categories);
  const [selectedCategory, setSelectedCategory] = useState<Option | null>(null);

  useEffect(() => {
    if (isOpen) {
      setName(item.name);
      setQuantity(item.quantity);
      setCategoryId(item.categoryId ?? "");
      setSelectedCategory(
        categoryOptions.find((opt) => opt.value === item.categoryId) ?? null,
      );
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        await updatePackingItemAction(item.id, tripId, item.packingListId, {
          name,
          quantity,
          categoryId: categoryId || null,
        });
        toast.success("Item updated");
        onClose();
      } catch {
        toast.error("Failed to update item");
      }
    });
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-md rounded bg-white p-6 shadow-xl">
          <DialogTitle className="mb-4 text-lg font-semibold">
            Edit Packing Item
          </DialogTitle>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Item name"
              className="w-full rounded border border-gray-300 px-3 py-2"
            />

            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              required
              min={1}
              className="w-full rounded border border-gray-300 px-3 py-2"
            />

            <CategorySelect
              userId={userId}
              categories={categories}
              tripId={tripId}
              packingListId={item.packingListId}
              value={selectedCategory}
              onChange={(option) => {
                setSelectedCategory(option);
                setCategoryId(option?.value ?? "");
              }}
            />

            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="cursor-pointer rounded px-4 py-2 text-gray-600 hover:text-black"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="cursor-pointer rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
