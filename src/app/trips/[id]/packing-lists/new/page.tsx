import { getCurrentUser } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import { PackingListForm } from "@/app/components/lists/packing-list-form";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { TemplateService } from "@/services/template-service";

export default async function NewPackingListPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  let user;
  try {
    user = await getCurrentUser();
  } catch {
    redirect("/signin");
  }

  const { id } = await params;
  const templateService = new TemplateService();
  const templates = await templateService.getTemplatesByUser(user.id);

  return (
    <div className="mt-16 w-7xl overflow-hidden rounded-xl bg-gradient-to-bl from-neutral-50 via-neutral-50 to-zinc-100 shadow-lg">
      <div className="flex items-center justify-between p-12">
        <div className="flex items-center space-x-4">
          <Link
            href={`/trips/${id}/packing-lists/`}
            className="text-sm text-gray-600 transition hover:text-gray-800"
          >
            <ArrowLeftIcon className="size-4" />
          </Link>
          <h2 className="text-2xl font-medium">Create a Packing List</h2>
        </div>
      </div>
      <PackingListForm tripId={id} templates={templates} />
    </div>
  );
}
