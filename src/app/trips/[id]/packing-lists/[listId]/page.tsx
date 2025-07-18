import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { PackingListService } from "@/services/packing-list-service";
import { deletePackingListAction } from "../actions";
import ViewPackingList from "@/app/components/lists/view-list";
import { getCurrentUser } from "@/app/lib/auth";
import { CreateTemplateButton } from "@/app/components/lists/create-template-button";
import { ExportPDFButton } from "@/app/components/lists/export-pdf-button";
import { ExportShareLinkButton } from "@/app/components/lists/share-button";

export default async function ViewPackingListPage({
  params,
}: {
  params: Promise<{ id: string; listId: string }>;
}) {
  const { id, listId } = await params;
  const service = new PackingListService();
  const list = await service.getPackingListById(id, listId);

  if (!list) {
    return <p className="p-12">No lists available. Start by creating one.</p>;
  }

  const user = await getCurrentUser();

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
          <ExportShareLinkButton userId={user.id} list={list} />
          <ExportPDFButton
            tripId={list.tripId}
            packingListId={list.id}
            packingListName={list.name}
          />
          <CreateTemplateButton
            userId={user.id}
            packingListName={list.name}
            packingListId={listId}
          />
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
