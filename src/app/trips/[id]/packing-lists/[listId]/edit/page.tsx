import { getCurrentUser } from "@/app/lib/auth";
import { PackingListService } from "@/services/packing-list-service";
import { redirect } from "next/navigation";
import { PackingListForm } from "@/app/components/lists/packing-list-form";

export default async function EditPackingListPage({
  params,
}: {
  params: { id: string; listId: string };
}) {
  const user = await getCurrentUser();
  const service = new PackingListService();
  const { id, listId } = await params;
  const list = await service.getPackingListById(listId);

  if (!list || list.trip.userId !== user.id) {
    redirect("/signin");
  }

  return (
    <div className="mt-16 w-7xl overflow-hidden rounded-xl bg-gradient-to-bl from-neutral-50 via-neutral-50 to-zinc-100 shadow-lg">
      <div className="flex items-center justify-between p-12">
        <h2 className="text-2xl font-medium">Edit Packing List</h2>
      </div>
      <PackingListForm tripId={id} listId={listId} initialTitle={list.name} />
    </div>
  );
}
