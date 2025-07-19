import { CreateTripForm } from "@/app/components/trips/create-trip-form";
import { getCurrentUser } from "@/app/lib/auth";
import { redirect } from "next/navigation";

export default async function NewTripPage() {
  let user;
  try {
    user = await getCurrentUser();
  } catch (err) {
    console.error(err);
    redirect("/signin");
  }

  return (
    <div className="min-h-md mt-16 w-7xl overflow-hidden rounded-xl bg-gradient-to-bl from-neutral-50 via-neutral-50 to-zinc-100 shadow-lg">
      <div className="flex items-center justify-between p-12">
        <h2 className="text-2xl font-medium">Create a New Trip</h2>
      </div>
      <CreateTripForm userId={user.id} />
    </div>
  );
}
