import { NextRequest, NextResponse } from "next/server";
import { getAuthorizedUser } from "@/app/lib/auth";
import { TemplateService } from "@/services/template-service";
import { applyTemplateSchema } from "@/app/lib/validation/templates";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getAuthorizedUser();
  if (user instanceof NextResponse) return user;

  const body = await req.json();
  const parsed = applyTemplateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const service = new TemplateService();
  const result = await service.applyTemplateToTrip(
    params.id,
    parsed.data.tripId
  );
  return NextResponse.json(result, { status: 201 });
}
