"use client";

import { useState, useTransition } from "react";
import { ToggleAddRowButton } from "./add-item-row-button";
import { PackingCheckbox } from "./packing-checkbox";
import { TrashIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { Category, PackingList, PackingListItem } from "@/app/lib/types";
import { deletePackingListItemAction } from "@/app/trips/[id]/packing-lists/actions";
import React from "react";
import { AddPackingItemRow } from "./add-packing-item-row";
import toast from "react-hot-toast";
import { EditPackingItemModal } from "./edit-list-modal";
import { MobilePackingForm } from "./create-list-mobile";

export function PackingListTable({
  list,
  userId,
  progress,
  totalCount,
  categories,
}: {
  list: PackingList;
  userId: string;
  progress: number;
  totalCount: number;
  categories?: Category[];
}) {
  const [editingItem, setEditingItem] = useState<PackingListItem | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [_, startTransition] = useTransition();
  const progressBarColor = progress > 0 ? "bg-blue-600" : "bg-gray-200";

  const handleDelete = (tripId: string, itemId: string, listId: string) => {
    const confirmed = confirm("Are you sure you want to delete this item?");
    if (!confirmed) return;

    setDeletingId(itemId);

    startTransition(async () => {
      try {
        await deletePackingListItemAction(tripId, itemId, listId);
        toast.success("Item deleted");
      } catch (err) {
        toast.error("Failed to delete item");
      } finally {
        setDeletingId(null);
      }
    });
  };

  return (
    <div className="w-full overflow-x-auto px-4 pb-12 sm:px-12">
      <div className="hidden md:block">
        <table className="w-full divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white">
          <thead className="bg-stone-100 text-left">
            <tr>
              <th className="px-4 py-3 text-center font-semibold text-gray-600">
                Packed
              </th>
              <th className="px-4 py-3 font-semibold text-gray-600">
                Item Name
              </th>
              <th className="px-4 py-3 font-semibold text-gray-600">
                Quantity
              </th>
              <th className="px-4 py-3 font-semibold text-gray-600">
                Category
              </th>
              <th className="px-4 py-3 font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {!list.items?.length && !showForm && (
              <tr>
                <td colSpan={5} className="p-7 text-gray-600">
                  Click the add item button below to start adding packing items!
                </td>
              </tr>
            )}
            {list.items?.map((item) => (
              <React.Fragment key={item.id}>
                <tr className="transition hover:bg-gray-50">
                  <td className="items-center px-3 py-4 text-center font-semibold text-gray-800">
                    <PackingCheckbox
                      defaultChecked={item.packed}
                      tripId={list.tripId}
                      itemId={item.id}
                    />
                  </td>
                  <td className="px-4 py-4 font-medium text-gray-800">
                    {item.name}
                  </td>
                  <td className="px-4 py-4 font-medium text-gray-800">
                    {item.quantity}
                  </td>
                  <td className="px-4 py-4 font-medium text-gray-800">
                    {item.category?.name || "No Category"}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
                      <PencilSquareIcon
                        className="h-5 w-5 cursor-pointer text-gray-500 hover:text-gray-700"
                        onClick={() => setEditingItem(item)}
                      />
                      {editingItem && (
                        <EditPackingItemModal
                          userId={userId}
                          tripId={list.tripId}
                          item={editingItem}
                          isOpen={!!editingItem}
                          onClose={() => setEditingItem(null)}
                          categories={categories}
                        />
                      )}
                      <button
                        onClick={() =>
                          handleDelete(list.tripId, item.id, list.id)
                        }
                        disabled={deletingId === item.id}
                        className="cursor-pointer text-red-500 hover:text-red-700"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              </React.Fragment>
            ))}
            <tr
              className={`${showForm ? "" : "pointer-events-none invisible"} transition`}
            >
              <AddPackingItemRow
                userId={userId}
                tripId={list.tripId}
                packingListId={list.id}
                categories={categories}
                onAfterSubmit={() => setShowForm(false)}
              />
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-6 md:hidden">
        {showForm && (
          <MobilePackingForm
            userId={userId}
            tripId={list.tripId}
            packingListId={list.id}
            categories={categories}
            onAfterSubmit={() => setShowForm(false)}
          />
        )}
      </div>

      <div className="block space-y-4 md:hidden">
        {!list.items?.length && !showForm && (
          <p className="px-8 text-gray-600">
            Click the add item button below to start adding packing items!
          </p>
        )}
        {list.items?.map((item) => (
          <div
            key={item.id}
            className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-600">
                {item.category?.name || "No Category"}
              </span>
              <PackingCheckbox
                defaultChecked={item.packed}
                tripId={list.tripId}
                itemId={item.id}
              />
            </div>
            <div className="text-lg font-bold text-gray-800">{item.name}</div>
            <div className="text-sm text-gray-600">Qty: {item.quantity}</div>
            <div className="mt-2 flex gap-4">
              <PencilSquareIcon
                className="h-5 w-5 cursor-pointer text-gray-500 hover:text-gray-700"
                onClick={() => setEditingItem(item)}
              />
              <button
                onClick={() => handleDelete(list.tripId, item.id, list.id)}
                disabled={deletingId === item.id}
                className="text-red-500 hover:text-red-700"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <ToggleAddRowButton
          showForm={showForm}
          onToggle={() => setShowForm((v) => !v)}
        />
        {totalCount > 0 && (
          <div className="flex w-full flex-col items-center gap-2 sm:w-1/3">
            <div className="h-6 w-full overflow-hidden rounded-full bg-gray-200">
              <div
                className={`flex h-full items-center justify-end pr-2 text-white transition-all duration-300 ${progressBarColor}`}
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-md font-medium text-gray-800">
              {progress} %
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
