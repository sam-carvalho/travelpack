import { getCurrentUser } from "@/app/lib/auth";
import { PackingListService } from "@/services/packing-list-service";
import { redirect } from "next/navigation";
import { PackingListForm } from "@/app/components/lists/packing-list-form";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

export default async function EditPackingListPage({
  params,
}: {
  params: Promise<{ id: string; listId: string }>;
}) {
  const { id, listId } = await params;
  const user = await getCurrentUser();
  const listService = new PackingListService();
  const list = await listService.getPackingListById(listId);

  if (!list || list.trip.userId !== user.id) {
    redirect("/signin");
  }

  return (
    <div className="mt-16 w-7xl overflow-hidden rounded-xl bg-gradient-to-bl from-neutral-50 via-neutral-50 to-zinc-100 shadow-lg">
      <div className="flex items-center justify-between p-12">
        <div className="flex items-center space-x-4">
          <Link
            href={`/trips/${id}/packing-lists`}
            className="text-sm text-gray-600 transition hover:text-gray-800"
          >
            <ArrowLeftIcon className="size-4" />
          </Link>
          <h2 className="text-2xl font-medium">Edit Packing List</h2>
        </div>
      </div>

      <PackingListForm tripId={id} listId={listId} initialTitle={list.name} />
    </div>
  );
}
