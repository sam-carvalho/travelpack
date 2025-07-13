import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const packingList = await prisma.packingList.findUnique({
    where: { id: params.id },
    include: { items: true, trip: true },
  });

  if (!packingList) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const payload = {
    name: packingList.name,
    destination: packingList.trip.destination,
    startDate: packingList.trip.startDate,
    endDate: packingList.trip.endDate,
    notes: packingList.trip.notes,
    items: packingList.items.map((item) => ({
      name: item.name,
      category: item.category,
      quantity: item.quantity,
    })),
  };

  return NextResponse.json(payload);
}
