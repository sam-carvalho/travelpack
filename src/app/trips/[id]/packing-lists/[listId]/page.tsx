import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { PackingListService } from "@/services/packing-list-service";
import { deletePackingListAction } from "../actions";
import { getCurrentUser } from "@/app/lib/auth";
import { CreateTemplateButton } from "@/app/components/lists/create-template-button";
import { ExportPDFButton } from "@/app/components/lists/export-pdf-button";
import { ExportShareLinkButton } from "@/app/components/lists/share-button";
import { redirect } from "next/navigation";
import { getProgressCounts } from "@/app/utils/getProgressCount";
import { CategoryService } from "@/services/category-service";
import { PackingListTable } from "@/app/components/lists/view-list-table";
import { DeleteListButton } from "@/app/components/lists/delete-list-button";

export default async function ViewPackingListPage({
  params,
}: {
  params: Promise<{ id: string; listId: string }>;
}) {
  let user;
  try {
    user = await getCurrentUser();
  } catch (err) {
    console.error(err);
    redirect("/signin");
  }

  const { id, listId } = await params;
  const listService = new PackingListService();
  const categoryService = new CategoryService();
  const [list, categories] = await Promise.all([
    listService.getPackingListById(listId),
    categoryService.getAllCategories(user.id),
  ]);

  const { totalCount, progress } = getProgressCounts(list);

  if (!list) {
    return <p className="p-12">No lists available. Start by creating one.</p>;
  }

  return (
    <div className="min-h-md mt-10 w-7xl overflow-hidden rounded-xl bg-zinc-50 shadow-lg">
      <div className="flex items-center justify-between p-12">
        <div className="flex items-center space-x-4">
          <Link
            href={`/trips/${id}/packing-lists`}
            className="text-sm text-gray-600 transition hover:text-gray-800"
          >
            <ArrowLeftIcon className="size-4" />
          </Link>
          <h1 className="text-2xl font-medium">{list.name}</h1>
        </div>
        <div className="flex items-center space-x-4">
          <CreateTemplateButton
            userId={user.id}
            packingListId={listId}
            packingListName={list.name}
          />
        </div>
      </div>
      <PackingListTable
        list={list}
        userId={user.id}
        progress={progress}
        totalCount={totalCount}
        categories={categories}
      />
      <div className="flex items-center justify-between gap-4 px-12 pb-12">
        <div className="flex gap-4 bg-gray-50">
          <ExportShareLinkButton userId={user.id} list={list} />
          <ExportPDFButton
            packingListId={list.id}
            packingListName={list.name}
          />
        </div>
        <div className="flex justify-end bg-gray-50">
          <DeleteListButton
            packingListId={list.id}
            tripId={list.tripId}
            deletePackingListAction={deletePackingListAction}
            label="Delete Packing List"
            className="h-14 cursor-pointer rounded-md border border-red-300 px-3 py-2 text-sm text-red-600 hover:bg-red-50 md:h-10"
          />
        </div>
      </div>
    </div>
  );
}
