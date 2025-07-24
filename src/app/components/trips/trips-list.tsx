import Link from "next/link";
import { deleteTripAction } from "@/app/trips/actions";
import React from "react";
import { Trip } from "@/generated/prisma";
import { DeleteTripButton } from "./delete-trip-button";

export default async function TripsList({
  userId,
  trips,
}: {
  userId: string;
  trips: Trip[];
}) {
  if (trips.length === 0) {
    return (
      <div className="py-8 text-center text-gray-500">
        <p className="text-lg">Click &quot;New Trip&quot; to get started.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto px-12 pb-12">
      <div className="flex flex-col gap-4 md:hidden">
        {trips.map((trip) => (
          <div
            key={trip.id}
            className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
          >
            <div className="text-xl font-semibold text-gray-800">
              {trip.name}
            </div>
            <div className="text-sm text-gray-600">
              Destination: {trip.destination}
            </div>
            <div className="text-sm text-gray-600">
              Dates: {new Date(trip.startDate).toLocaleDateString()} –{" "}
              {new Date(trip.endDate).toLocaleDateString()}
            </div>
            {trip.notes && (
              <div className="text-sm text-gray-500">Notes: {trip.notes}</div>
            )}
            <div className="mt-4 flex justify-end gap-2">
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
              <DeleteTripButton
                userId={userId}
                tripId={trip.id}
                deleteTripAction={deleteTripAction}
              />
            </div>
          </div>
        ))}
      </div>
      <table className="hidden w-full divide-y divide-gray-200 rounded-lg border border-gray-200 md:table">
        <thead className="bg-stone-100 text-left">
          <tr>
            <th className="px-6 py-3 font-semibold text-gray-600">Trip</th>
            <th className="px-6 py-3 font-semibold text-gray-600">
              Destination
            </th>
            <th className="px-6 py-3 font-semibold text-gray-600">
              Travel Dates
            </th>
            <th className="px-6 py-3 font-semibold text-gray-600">Notes</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {trips.map((trip) => (
            <React.Fragment key={trip.id}>
              <tr className="transition hover:bg-gray-50">
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
                  <div className="flex justify-end gap-2">
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
                    <DeleteTripButton
                      userId={userId}
                      tripId={trip.id}
                      deleteTripAction={deleteTripAction}
                    />
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
