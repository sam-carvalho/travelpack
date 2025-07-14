import Link from "next/link";
import { deletePackingListAction } from "../../trips/[id]/packing-lists/actions";
import { PackingList } from "../../lib/types";
import React from "react";

export default async function PackingLists({
  lists,
}: {
  lists: PackingList[];
}) {
  return (
    <div className="overflow-x-auto px-12 pb-12">
      <table className="w-full rounded-lg border border-gray-200 divide-y divide-gray-200">
        <thead className="bg-stone-100 text-left">
          <tr>
            <th className="px-6 py-3 text-gray-600 font-semibold">Name</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {lists.map((list) => (
            <React.Fragment key={list.id}>
              <tr className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 font-semibold text-gray-800">
                  {list.name}
                </td>
              </tr>
              <tr className="bg-white">
                <td colSpan={4} className="px-6 py-4">
                  <div className="flex gap-2 justify-end">
                    <Link
                      href={`/trips/${list.tripId}/packing-lists/${list.id}`}
                      className="rounded-md border border-gray-300 px-3 py-1 text-sm text-gray-800 hover:bg-gray-100"
                    >
                      View
                    </Link>
                    <Link
                      href={`/trips/${list.tripId}/packing-lists/${list.id}/edit`}
                      className="rounded-md border border-gray-300 px-3 py-1 text-sm text-gray-800 hover:bg-gray-100"
                    >
                      Edit
                    </Link>
                    <form
                      action={deletePackingListAction.bind(
                        null,
                        list.tripId,
                        list.id
                      )}
                    >
                      <button
                        type="submit"
                        className="rounded-md border border-red-300 px-3 py-1 text-sm text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
