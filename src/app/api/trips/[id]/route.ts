import { NextRequest, NextResponse } from "next/server";
import { TripService } from "@/services/trip-service";
import { getAuthorizedUser } from "@/app/lib/auth";
import { updateTripSchema } from "@/app/lib/validation/trips";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getAuthorizedUser();

  if (user instanceof NextResponse) {
    // If getAuthorizedUser returns a NextResponse,
    // it means there was an error (e.g., unauthorized)
    // so we return it directly
    return user;
  }

  const tripService = new TripService();
  const trip = await tripService.getTripById(params.id, user!.id);

  if (!trip)
    return NextResponse.json({ error: "Trip not found" }, { status: 404 });
  return NextResponse.json(trip);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getAuthorizedUser();

  if (user instanceof NextResponse) {
    // If getAuthorizedUser returns a NextResponse,
    // it means there was an error (e.g., unauthorized)
    // so we return it directly
    return user;
  }

  const body = await req.json();
  const parsed = updateTripSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const tripService = new TripService();
  const updates = {
    ...parsed.data,
    startDate: parsed.data.startDate
      ? new Date(parsed.data.startDate)
      : undefined,
    endDate: parsed.data.endDate ? new Date(parsed.data.endDate) : undefined,
  };
  await tripService.updateTrip(params.id, user!.id, updates);
  return NextResponse.json({ success: true });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getAuthorizedUser();

  if (user instanceof NextResponse) {
    // If getAuthorizedUser returns a NextResponse,
    // it means there was an error (e.g., unauthorized)
    // so we return it directly
    return user;
  }

  const tripService = new TripService();
  await tripService.deleteTrip(params.id, user!.id);
  return NextResponse.json({ success: true });
}
