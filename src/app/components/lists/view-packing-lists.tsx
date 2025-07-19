import Link from "next/link";
import { deletePackingListAction } from "../../trips/[id]/packing-lists/actions";
import { PackingList } from "../../lib/types";
import React from "react";

export default async function PackingLists({
  lists,
}: {
  lists: PackingList[];
}) {
  if (!lists) {
    return (
      <p className="p-12">
        {" "}
        No items found in this packing list. Use a{" "}
        <Link href="/templates">template</Link> to create one or start by adding
        items!
      </p>
    );
  }
  return (
    <div className="w-full overflow-x-auto px-4 py-4 pb-12 sm:px-12">
      <div className="flex items-center justify-center">
        <table className="w-3xl table-auto divide-y divide-gray-200 overflow-hidden rounded-lg border border-gray-800 text-sm sm:text-base">
          <thead className="bg-stone-100">
            <tr>
              <th className="px-4 py-2 text-left font-semibold text-gray-600">
                Name
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {lists.map((list) => (
              <React.Fragment key={list.id}>
                <tr className="transition hover:bg-gray-50">
                  <td className="px-4 py-5 font-semibold text-gray-800">
                    {list.name}
                  </td>
                </tr>
                <tr>
                  <td className="bg-white px-4 py-3">
                    <div className="flex flex-wrap justify-end gap-2">
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
                          list.id,
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
    </div>
  );
}
