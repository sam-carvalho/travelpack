"use client";

import { useState } from "react";
import { ToggleAddRowButton } from "./add-item-row-button";
import { PackingCheckbox } from "./packing-checkbox";
import { TrashIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { Category, PackingList } from "@/app/lib/types";
import { deletePackingListItemAction } from "@/app/trips/[id]/packing-lists/actions";
import React from "react";
import { AddPackingItemRow } from "./add-packing-item-row";
import Link from "next/link";

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
  const [showForm, setShowForm] = useState(false);
  const progressBarColor = progress > 0 ? "bg-blue-600" : "bg-gray-200";

  return (
    <div className="px-12 pb-12">
      <table className="w-full rounded-lg border border-gray-200 divide-y divide-gray-200">
        <thead className="bg-stone-100 text-left">
          <tr>
            <th className="px-4 py-3 text-gray-600 font-semibold text-center">
              Packed
            </th>
            <th className="px-4 py-3 text-gray-600 font-semibold">Item Name</th>
            <th className="px-4 py-3 text-gray-600 font-semibold">Quantity</th>
            <th className="px-4 py-3 text-gray-600 font-semibold">Category</th>
            <th className="px-4 py-3 text-gray-600 font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {!list.items || list.items.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-6 py-4 text-gray-500">
                No items found in this packing list. Use a{" "}
                <Link href="/templates">template</Link> to create one or start
                by adding items!
              </td>
            </tr>
          ) : null}
          {list.items?.map((item) => (
            <React.Fragment key={item.id}>
              <tr className="hover:bg-gray-50 transition">
                <td className="px-3 py-4 font-semibold text-gray-800 items-center text-center">
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
                  <div className="flex gap-2">
                    <PencilSquareIcon
                      className="h-5 w-5 text-gray-500 cursor-pointer hover:text-gray-700"
                      href={`/trips/${list.tripId}/packing-lists/${list.id}/items/${item.id}/edit`}
                    />
                    <form
                      action={deletePackingListItemAction.bind(
                        null,
                        list.tripId,
                        item.id,
                        list.id
                      )}
                    >
                      <button type="submit">
                        <TrashIcon className="h-5 w-5 text-red-500 cursor-pointer hover:text-red-700" />
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            </React.Fragment>
          ))}
          <tr
            className={`${
              showForm ? "" : "invisible pointer-events-none"
            } bg-white hover:bg-gray-50 transition
            `}
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
      <div className="flex items-center justify-between mt-4">
        <ToggleAddRowButton
          showForm={showForm}
          onToggle={() => setShowForm((v) => !v)}
        />
        {totalCount > 0 && (
          <div className="w-1/3 flex flex-col items-center gap-2">
            <div className="w-full h-6 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 text-white flex justify-end pr-2 items-center ${progressBarColor}`}
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
