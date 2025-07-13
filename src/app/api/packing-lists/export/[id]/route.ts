import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { getAuthorizedUser } from "@/app/lib/auth";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const user = await getAuthorizedUser();
  if (user instanceof NextResponse) return user;

  const packingList = await prisma.packingList.findFirst({
    where: { id: params.id, trip: { userId: user.id } },
    include: { items: true, trip: true },
  });

  if (!packingList) {
    return NextResponse.json(
      { error: "Packing list not found" },
      { status: 404 }
    );
  }

  const link = `${process.env.NEXT_PUBLIC_BASE_URL}/import?id=${packingList.id}`;
  return NextResponse.json({ link });
}
