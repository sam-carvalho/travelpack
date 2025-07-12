import { PackingListService } from "@/services/packing-list-service";
import { NextRequest, NextResponse } from "next/server";
import { getAuthorizedUser } from "@/app/lib/auth";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getAuthorizedUser();
  if (user instanceof NextResponse) return user;

  const body = await req.json();
  const packingListService = new PackingListService();
  await packingListService.updatePackingList(params.id, body);

  return NextResponse.json({ success: true });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getAuthorizedUser();
  if (user instanceof NextResponse) return user;

  const packingListService = new PackingListService();
  await packingListService.deletePackingList(params.id);

  return NextResponse.json({ success: true });
}
