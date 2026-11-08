import { NextRequest } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { PackingListService } from "@/services/packing-list-service";
import { PackingListPdf } from "@/app/components/lists/list-pdf";
import React from "react";
import { PackingListItem } from "@/app/lib/types";
import { getCurrentUser } from "@/app/lib/auth";
import { assertListOwner, NotFoundError } from "@/app/lib/authz";
import { attachmentDisposition } from "@/app/utils/contentDisposition";

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const { searchParams } = new URL(req.url);
  const packingListId = searchParams.get("packingListId");

  if (!packingListId) {
    return new Response("Missing packingListId", { status: 400 });
  }

  try {
    await assertListOwner(user.id, packingListId);
  } catch (error) {
    if (error instanceof NotFoundError) {
      return new Response("Packing list not found", { status: 404 });
    }
    throw error;
  }

  const service = new PackingListService();
  const list = await service.getPackingListById(packingListId);
  if (!list) return new Response("Packing list not found", { status: 404 });

  const pdfItems = list.items.map((item) => ({
    ...item,
    category: item.category === null ? undefined : item.category,
  })) as PackingListItem[];

  const pdfBuffer = await renderToBuffer(
    React.createElement(PackingListPdf, { title: list.name, items: pdfItems }),
  );

  return new Response(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": attachmentDisposition(`${list.name}.pdf`),
    },
  });
}
