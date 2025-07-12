import { getAuthorizedUser } from "@/app/lib/auth";
import { createPackingListSchema } from "@/app/lib/validation/packing-list";
import { PackingListService } from "@/services/packing-list-service";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const user = await getAuthorizedUser();
  if (user instanceof NextResponse) return user;

  const body = await req.json();
  const parsed = createPackingListSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const packingListService = new PackingListService();
  const packingList = await packingListService.createPackingList(
    parsed.data.tripId,
    parsed.data
  );

  return NextResponse.json(packingList, { status: 201 });
}
