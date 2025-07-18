import { redirect } from "next/navigation";
import { getCurrentUser } from "../lib/auth";
import { PackingListService } from "@/services/packing-list-service";
import { importPackingList } from "./actions";

export default async function ImportPage({
  searchParams,
}: {
  searchParams: { listId: string };
}) {
  const user = await getCurrentUser();
  const listId = await searchParams.listId;

  if (!listId) redirect("/404");

  const service = new PackingListService();
  const sharedList = await service.getExportedPackingListById(listId);

  if (!sharedList) redirect("/404");

  if (!user) {
    redirect(`/signin?callbackUrl=/import?listId=${listId}`);
  }

  const tripId = await importPackingList(user.id, sharedList);
  redirect(`/trips/${tripId}/packing-lists`);
}
