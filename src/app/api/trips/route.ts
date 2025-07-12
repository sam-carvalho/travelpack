import { NextResponse } from "next/server";
import { getAuthorizedUser } from "@/app/lib/auth";
import { TripService } from "@/services/trip-service";
import { createTripSchema } from "@/app/lib/validation/trips";

export async function POST(req: Request) {
  const user = await getAuthorizedUser();

  if (user instanceof NextResponse) {
    // If getAuthorizedUser returns a NextResponse,
    // it means there was an error (e.g., unauthorized)
    // so we return it directly
    return user;
  }

  const body = await req.json();
  const parsed = createTripSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const tripService = new TripService();
  const tripInput = {
    ...parsed.data,
    startDate: new Date(parsed.data.startDate),
    endDate: new Date(parsed.data.endDate),
  };
  const trip = await tripService.createTrip(user.id, tripInput);

  return NextResponse.json(trip, { status: 201 });
}

export async function GET() {
  const user = await getAuthorizedUser();

  if (user instanceof NextResponse) {
    // If getAuthorizedUser returns a NextResponse,
    // it means there was an error (e.g., unauthorized)
    // so we return it directly
    return user;
  }

  const tripService = new TripService();
  const trips = await tripService.getTripsByUser(user.id);

  return NextResponse.json(trips);
}
