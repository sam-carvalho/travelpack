import { ItemService } from "@/services/item-service";
import { getAuthorizedUser } from "@/app/lib/auth";
import { NextResponse } from "next/server";
import { createItemSchema } from "@/app/lib/validation/items";

export async function POST(req: Request) {
  const user = await getAuthorizedUser();
  if (user instanceof NextResponse) return user;

  const body = await req.json();
  const parsed = createItemSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const itemService = new ItemService();
  const item = await itemService.addItem(body.packingListId, parsed.data);

  return NextResponse.json(item, { status: 201 });
}
