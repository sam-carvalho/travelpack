import { getCurrentUser } from "@/app/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PackingListService } from "@/services/packing-list-service";
import PackingLists from "@/app/components/lists/view-packing-lists";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";

export default async function ViewPackingListsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const user = await getCurrentUser();
  if (!user) {
    redirect(`/signin?callbackUrl=/trips/${id}/packing-lists`);
  }

  const service = new PackingListService();
  const packingLists = await service.getPackingListsByTrip(id);

  return (
    <div className="min-h-lg mt-10 w-7xl overflow-hidden rounded-xl bg-zinc-50 pb-12 shadow-lg">
      <div className="flex items-center justify-between p-12">
        <div className="flex items-center space-x-4">
          <Link
            href={`/trips/${id}`}
            className="text-sm text-gray-600 transition hover:text-gray-800"
          >
            <ArrowLeftIcon className="size-4" />
          </Link>
          <h1 className="text-2xl font-medium">Your Packing Lists</h1>
        </div>
        <Link
          href={`/trips/${id}/packing-lists/new`}
          className="rounded-lg bg-gradient-to-r from-amber-500 to-pink-500 px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:to-pink-800"
        >
          New Packing List
        </Link>
      </div>
      {!packingLists.length && (
        <p className="px-20 pb-12 text-gray-700">
          Click &quot;New Packing List&quot; to get started.
        </p>
      )}
      {packingLists && packingLists.length > 0 && (
        <PackingLists lists={packingLists} />
      )}
    </div>
  );
}
