import { getCurrentUser } from "@/app/lib/auth";
import { TripService } from "@/services/trip-service";
import { redirect } from "next/navigation";
import { EditTripForm } from "@/app/components/trips/edit-trip-form";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";

export default async function EditTripPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const user = await getCurrentUser();
  if (!user) {
    redirect(`/signin?callbackUrl=/trips/${id}/edit`);
  }

  const service = new TripService();
  const trip = await service.getTripById(user.id, id);

  if (!trip) {
    return <p className="px-12 pb-12">Oh no! Trip not found.</p>;
  }

  return (
    <div className="mt-10 w-7xl overflow-hidden rounded-xl bg-zinc-50 shadow-lg">
      <div className="flex items-center justify-between p-12">
        <div className="flex items-center space-x-4">
          <Link
            href={`/trips/`}
            className="text-sm text-gray-600 transition hover:text-gray-800"
          >
            <ArrowLeftIcon className="size-4" />
          </Link>
          <h1 className="text-2xl font-medium">Edit your trip details</h1>
        </div>
      </div>

      <EditTripForm
        userId={user.id}
        trip={{
          ...trip,
          startDate: new Date(trip.startDate).toISOString().split("T")[0],
          endDate: new Date(trip.endDate).toISOString().split("T")[0],
          notes: trip.notes ?? undefined,
        }}
      />
    </div>
  );
}
