import { getCurrentUser } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import { PackingListForm } from "@/app/components/lists/packing-list-form";

export default async function NewPackingListPage({
  params,
}: {
  params: { id: string };
}) {
  try {
    await getCurrentUser();
  } catch {
    redirect("/signin");
  }

  return (
    <div className="mt-16 w-7xl overflow-hidden rounded-xl bg-gradient-to-bl from-neutral-50 via-neutral-50 to-zinc-100 shadow-lg">
      <div className="flex items-center justify-between p-12">
        <h2 className="text-2xl font-medium">Create a Packing List</h2>
      </div>
      <PackingListForm tripId={params.id} />
    </div>
  );
}
