import TripsList from "@/app/components/trips/trips-list";
import Link from "next/link";

export default function TripsPage() {
  return (
    <div className="mt-10 rounded-xl overflow-hidden shadow-lg bg-zinc-50">
      <div className="flex items-center justify-between p-12">
        <h2 className="text-2xl font-medium">Your Trips</h2>
        <Link
          href="/trips/new"
          className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-amber-500 to-pink-500 text-white rounded-lg hover:to-pink-800 transition-all duration-300"
        >
          New Trip
        </Link>
      </div>
      <TripsList />
    </div>
  );
}
