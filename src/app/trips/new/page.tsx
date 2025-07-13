import { TripForm } from "@/app/components/trips/trip-form";

export default function NewTripPage() {
  return (
    <div className="mt-16 rounded-xl overflow-hidden shadow-lg bg-gradient-to-bl from-neutral-50 via-neutral-50 to-zinc-100">
      <div className="flex items-center justify-between p-12">
        <h2 className="text-2xl font-medium">Create a New Trip</h2>
      </div>
      <TripForm />
    </div>
  );
}
