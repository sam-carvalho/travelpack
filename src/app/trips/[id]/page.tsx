import { getCurrentUser } from "@/app/lib/auth";
import { TripService } from "@/services/trip-service";
import Link from "next/link";
import { redirect } from "next/navigation";
import { deleteTripAction } from "../actions";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";

export default async function ViewTripPage({
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
  const service = new TripService();
  const trip = await service.getTripById(user.id, id);

  if (!trip) {
    return <p className="px-12 pb-12">Oh no! Trip not found.</p>;
  }

  return (
    <div className="mt-10 rounded-xl overflow-hidden shadow-lg bg-zinc-50">
      <div className="flex items-center justify-between p-12">
        <div className="flex items-center space-x-4">
          <Link
            href={`/trips/`}
            className="text-sm text-gray-600 hover:text-gray-800 transition"
          >
            <ArrowLeftIcon className="size-4" />
          </Link>
          <h1 className="text-2xl font-medium">{trip.name}</h1>
        </div>
        <Link
          href={`/trips/${trip.id}/packing-lists`}
          className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-amber-500 to-pink-500 text-white rounded-lg hover:to-pink-800 transition-all duration-300"
        >
          Packing Lists
        </Link>
      </div>
      <div className="px-12 pb-6">
        <p className="text-gray-600 mb-2">
          <strong>Destination:</strong> {trip.destination}
        </p>

        <p className="text-gray-600 mb-2">
          <strong>Dates: </strong>
          {new Date(trip.startDate).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}{" "}
          –{" "}
          {new Date(trip.endDate).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </p>

        {trip.notes && (
          <p className="text-gray-600 mb-2">
            <strong>Notes:</strong> {trip.notes}
          </p>
        )}
      </div>

      <div className="flex gap-4 px-12 pb-12 bg-gray-50">
        <Link
          href={`/trips/${trip.id}/edit`}
          className="rounded-md border border-gray-300 px-3 py-1 text-sm text-gray-800 hover:bg-gray-100"
        >
          Edit
        </Link>
        <form action={deleteTripAction.bind(null, user.id, trip.id)}>
          <button
            type="submit"
            className="rounded-md border border-red-300 px-3 py-1 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
          >
            Delete
          </button>
        </form>
      </div>
    </div>
  );
}
