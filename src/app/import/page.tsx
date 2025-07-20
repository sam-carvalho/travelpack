import { redirect } from "next/navigation";
import { getCurrentUser } from "../lib/auth";
import { PackingListService } from "@/services/packing-list-service";
import { importPackingList } from "./actions";

export default async function ImportPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const listId =
    typeof searchParams?.listId === "string" ? searchParams.listId : undefined;
  const user = await getCurrentUser();

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
