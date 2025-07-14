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
  let user;
  try {
    user = await getCurrentUser();
  } catch (err) {
    console.error(err);
    redirect("/signin");
  }
  const { id } = await params;
  const service = new PackingListService();
  const packingLists = await service.getPackingListsByTrip(id);

  if (!packingLists) {
    return (
      <p className="px-12 pb-12">
        No packing lists found. Start by creating one!
      </p>
    );
  }

  return (
    <div className="mt-10 pb-12 rounded-xl overflow-hidden shadow-lg bg-zinc-50">
      <div className="flex items-center justify-between p-12">
        <div className="flex items-center space-x-4">
          <Link
            href={`/trips/${id}`}
            className="text-sm text-gray-600 hover:text-gray-800 transition"
          >
            <ArrowLeftIcon className="size-4" />
          </Link>
          <h1 className="text-2xl font-medium">Your Packing Lists</h1>
        </div>
        <Link
          href={`/trips/${id}/packing-lists/new`}
          className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-amber-500 to-pink-500 text-white rounded-lg hover:to-pink-800 transition-all duration-300"
        >
          New Packing List
        </Link>
      </div>
      <PackingLists lists={packingLists} />
    </div>
  );
}
