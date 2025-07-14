import Link from "next/link";
import { deletePackingListAction } from "../../trips/[id]/packing-lists/actions";
import { PackingList } from "../../lib/types";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import React from "react";
import { getProgressCounts } from "@/app/utils/getProgressCount";
import { PackingCheckbox } from "./packing-checkbox";

export default async function ViewPackingList({ list }: { list: PackingList }) {
  const { totalCount, progress } = getProgressCounts(list);
  return (
    <div className="overflow-x-auto px-12 pb-12">
      <table className="w-full rounded-lg border border-gray-200 divide-y divide-gray-200">
        <thead className="bg-stone-100 text-left">
          <tr>
            <th className="px-6 py-3 text-gray-600 font-semibold">Packed</th>
            <th className="px-6 py-3 text-gray-600 font-semibold">Item Name</th>
            <th className="px-6 py-3 text-gray-600 font-semibold">Quantity</th>
            <th className="px-6 py-3 text-gray-600 font-semibold">Category</th>
            <th className="px-6 py-3 text-gray-600 font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {!list.items || list.items.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-6 py-4 text-gray-500">
                No items found in this packing list. Start by adding some!
              </td>
            </tr>
          ) : null}
          {list.items?.map((item) => (
            <React.Fragment key={item.id}>
              <tr className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 font-semibold text-gray-800">
                  <PackingCheckbox
                    defaultChecked={item.packed}
                    tripId={list.tripId}
                    itemId={item.id}
                  />
                </td>
                <td className="px-6 py-4 font-medium text-gray-800">
                  {item.name}
                </td>
                <td className="px-6 py-4 font-medium text-gray-800">
                  {item.quantity}
                </td>
                <td className="px-6 py-4 font-medium text-gray-800">
                  {item.category || "No Category"}
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <PencilSquareIcon
                      className="h-5 w-5 text-gray-500 cursor-pointer hover:text-gray-700"
                      href={`/trips/${list.tripId}/packing-lists/${list.id}/items/${item.id}/edit`}
                    />
                    <form
                      action={deletePackingListAction.bind(
                        null,
                        list.tripId,
                        item.id
                      )}
                    >
                      <TrashIcon className="h-5 w-5 text-red-500 cursor-pointer hover:text-red-700" />
                    </form>
                  </div>
                </td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>
      <div className="flex items-center justify-between mt-4">
        <Link
          href={`/trips/${list.tripId}/packing-lists/${list.id}/items/new`}
          className="px-4 py-2 text-md font-semibold rounded-lg text-gray-700 hover:text-blue-600"
        >
          + Add Item
        </Link>
        {totalCount > 0 && (
          <div className="w-1/3 h-4 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
