import { NextResponse } from "next/server";
import { getAuthorizedUser } from "@/app/lib/auth";
import { importPackingListSchema } from "@/app/lib/validation/packing-list";
import { TripService } from "@/services/trip-service";
import { PackingListService } from "@/services/packing-list-service";

export async function POST(req: Request) {
  const user = await getAuthorizedUser();
  if (user instanceof NextResponse) return user;

  const body = await req.json();
  const parsed = importPackingListSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
  }

  const tripService = new TripService();
  const tripInput = {
    name: `Imported Trip: ${parsed.data.name}`,
    destination: parsed.data.destination,
    startDate: new Date(parsed.data.startDate),
    endDate: new Date(parsed.data.endDate),
    notes: parsed.data.notes || "",
  };

  const trip = await tripService.createTrip(user.id, tripInput);

  const packingListService = new PackingListService();
  const newPackingList = {
    name: parsed.data.name,
    items: {
      create: parsed.data.items,
    },
  };
  const packingList = await packingListService.createPackingList(
    trip.id,
    newPackingList
  );

  return NextResponse.json({ id: packingList.id });
}
