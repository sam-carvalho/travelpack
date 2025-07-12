import { ItemService } from "@/services/item-service";
import { getAuthorizedUser } from "@/app/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { updateItemSchema } from "@/app/lib/validation/items";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getAuthorizedUser();
  if (user instanceof NextResponse) return user;

  const body = await req.json();
  const parsed = updateItemSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const itemService = new ItemService();
  await itemService.updateItem(params.id, parsed.data);

  return NextResponse.json({ success: true });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getAuthorizedUser();
  if (user instanceof NextResponse) return user;

  const itemService = new ItemService();
  await itemService.deleteItem(params.id);

  return NextResponse.json({ success: true });
}
