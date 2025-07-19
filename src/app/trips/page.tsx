import TripsList from "@/app/components/trips/trips-list";
import Link from "next/link";

export default function TripsPage() {
  return (
    <div className="mt-10 w-7xl overflow-hidden rounded-xl bg-zinc-50 shadow-lg">
      <div className="flex items-center justify-between p-12">
        <h1 className="text-2xl font-medium">Your Trips</h1>
        <Link
          href="/trips/new"
          className="rounded-lg bg-gradient-to-r from-amber-500 to-pink-500 px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:to-pink-800"
        >
          New Trip
        </Link>
      </div>
      <TripsList />
    </div>
  );
}
