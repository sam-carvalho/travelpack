import Link from "next/link";
import { TripService } from "@/services/trip-service";
import { getCurrentUser } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import { deleteTripAction } from "@/app/trips/actions";
import React from "react";

export default async function TripsList() {
  let user;
  try {
    user = await getCurrentUser();
  } catch (err) {
    console.error(err);
    redirect("/signin");
  }
  const service = new TripService();
  const trips = await service.getTripsByUser(user.id);

  if (trips.length === 0) {
    return (
      <p className="px-12 pb-12">No trips found. Start by creating one!</p>
    );
  }

  return (
    <div className="overflow-x-auto px-12 pb-12">
      <table className="w-full rounded-lg border border-gray-200 divide-y divide-gray-200">
        <thead className="bg-stone-100 text-left">
          <tr>
            <th className="px-6 py-3 text-gray-600 font-semibold">Trip</th>
            <th className="px-6 py-3 text-gray-600 font-semibold">
              Destination
            </th>
            <th className="px-6 py-3 text-gray-600 font-semibold">
              Travel Dates
            </th>
            <th className="px-6 py-3 text-gray-600 font-semibold">Notes</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {trips.map((trip) => (
            <React.Fragment key={trip.id}>
              <tr className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 font-bold text-gray-800">
                  {trip.name}
                </td>
                <td className="px-6 py-4 text-gray-700">{trip.destination}</td>
                <td className="px-6 py-4 text-gray-600">
                  {new Date(trip.startDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}{" "}
                  – <br />
                  {new Date(trip.endDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </td>
                <td className="px-6 py-4 text-gray-600">{trip.notes || ""}</td>
              </tr>
              <tr className="bg-white">
                <td colSpan={4} className="px-6 py-4">
                  <div className="flex gap-2 justify-end">
                    <Link
                      href={`/trips/${trip.id}`}
                      className="rounded-md border border-gray-300 px-3 py-1 text-sm text-gray-800 hover:bg-gray-100"
                    >
                      View
                    </Link>
                    <Link
                      href={`/trips/${trip.id}/edit`}
                      className="rounded-md border border-gray-300 px-3 py-1 text-sm text-gray-800 hover:bg-gray-100"
                    >
                      Edit
                    </Link>
                    <form
                      action={deleteTripAction.bind(null, user.id, trip.id)}
                    >
                      <button
                        type="submit"
                        className="rounded-md border border-red-300 px-3 py-1 text-sm text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
