import { PackingListService } from "@/services/packing-list-service";
import { NextRequest, NextResponse } from "next/server";
import { getAuthorizedUser } from "@/app/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getAuthorizedUser();
  if (user instanceof NextResponse) return user;

  const packingListService = new PackingListService();
  const list = await packingListService.getPackingListsByTrip(params.id);

  if (!list)
    return NextResponse.json(
      { error: "Packing list not found" },
      { status: 404 }
    );
  return NextResponse.json(list);
}
