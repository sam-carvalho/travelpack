import { ItemService } from "@/services/item-service";
import { getAuthorizedUser } from "@/app/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getAuthorizedUser();
  if (user instanceof NextResponse) return user;

  const itemService = new ItemService();
  const item = await itemService.getItemsByPackingList(params.id);

  if (!item)
    return NextResponse.json({ error: "Item not found" }, { status: 404 });
  return NextResponse.json(item);
}
