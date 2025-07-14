import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { PackingListService } from "@/services/packing-list-service";
import { deletePackingListAction } from "../actions";
import ViewPackingList from "@/app/components/lists/view-list";

export default async function ViewPackingListPage({
  params,
}: {
  params: Promise<{ id: string; listId: string }>;
}) {
  const { id, listId } = await params;
  const service = new PackingListService();
  const list = await service.getPackingListById(id, listId);

  if (!list) {
    return <p className="px-12 pb-12">Oh no! Trip not found.</p>;
  }

  return (
    <div className="mt-10 rounded-xl overflow-hidden shadow-lg bg-zinc-50">
      <div className="flex items-center justify-between p-12">
        <div className="flex items-center space-x-4">
          <Link
            href={`/trips/${id}/packing-lists`}
            className="text-sm text-gray-600 hover:text-gray-800 transition"
          >
            <ArrowLeftIcon className="size-4" />
          </Link>
          <h1 className="text-2xl font-medium">{list.name}</h1>
        </div>
        <div className="flex items-center space-x-4">
          <Link
            href={`/trips/${list.id}/packing-lists/${list.id}/share`}
            className="px-4 py-2 text-sm font-medium border border-gray-300 bg-gray-50 rounded-lg hover:bg-gray-100"
          >
            Share
          </Link>
          <Link
            href={`/trips/${list.id}/packing-lists/${list.id}/export-pdf`}
            className="px-4 py-2 text-sm font-medium border border-gray-300 bg-gray-50 rounded-lg hover:bg-gray-100"
          >
            Export PDF
          </Link>
          <Link
            href={`/trips/${list.id}/packing-lists`}
            className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-amber-500 to-pink-500 text-white rounded-lg hover:to-pink-800 transition-all duration-300"
          >
            Save Template
          </Link>
        </div>
      </div>
      <ViewPackingList list={list} />
      <div className="flex gap-4 px-12 pb-12 bg-gray-50 justify-end">
        <form action={deletePackingListAction.bind(null, id, listId)}>
          <button
            type="submit"
            className="rounded-md border border-red-300 px-3 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
          >
            Delete Packing List
          </button>
        </form>
      </div>
    </div>
  );
}
