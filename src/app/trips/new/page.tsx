import { CreateTripForm } from "@/app/components/trips/create-trip-form";
import { getCurrentUser } from "@/app/lib/auth";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function NewTripPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect(`/signin?callbackUrl=/trips/new`);
  }

  return (
    <div className="min-h-md mt-16 w-7xl overflow-hidden rounded-xl bg-gradient-to-bl from-neutral-50 via-neutral-50 to-zinc-100 shadow-lg">
      <div className="flex items-center justify-between p-12">
        <div className="flex items-center space-x-4">
          <Link
            href={`/trips/`}
            className="text-sm text-gray-600 transition hover:text-gray-800"
          >
            <ArrowLeftIcon className="size-4" />
          </Link>
          <h2 className="text-2xl font-medium">Create a New Trip</h2>
        </div>
      </div>
      <CreateTripForm userId={user.id} />
    </div>
  );
}
