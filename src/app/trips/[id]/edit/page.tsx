import { getCurrentUser } from "@/app/lib/auth";
import { TripService } from "@/services/trip-service";
import { redirect } from "next/navigation";
import { EditTripForm } from "@/app/components/trips/edit-trip-form";

export default async function EditTripPage({
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
        <h1 className="text-2xl font-medium">Edit your trip details</h1>
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
