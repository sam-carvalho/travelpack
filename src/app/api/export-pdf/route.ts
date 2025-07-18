import { NextRequest } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { PackingListService } from "@/services/packing-list-service";
import { PackingListPdf } from "@/app/components/lists/list-pdf";
import React from "react";
import { PackingListItem } from "@/app/lib/types";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tripId = searchParams.get("tripId");
  const packingListId = searchParams.get("packingListId");

  if (!tripId || !packingListId) {
    return new Response("Missing tripId or packingListId", { status: 400 });
  }

  const service = new PackingListService();
  const list = await service.getPackingListById(tripId, packingListId);
  if (!list) return new Response("Packing list not found", { status: 404 });

  const pdfItems = list.items.map((item) => ({
    ...item,
    category: item.category === null ? undefined : item.category,
  })) as PackingListItem[];

  const pdfBuffer = await renderToBuffer(
    React.createElement(PackingListPdf, { title: list.name, items: pdfItems })
  );

  return new Response(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${list.name}.pdf"`,
    },
  });
}
