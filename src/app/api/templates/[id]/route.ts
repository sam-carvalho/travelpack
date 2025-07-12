import { NextRequest, NextResponse } from "next/server";
import { getAuthorizedUser } from "@/app/lib/auth";
import { TemplateService } from "@/services/template-service";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getAuthorizedUser();
  if (user instanceof NextResponse) return user;

  const service = new TemplateService();
  const template = await service.getTemplateById(params.id, user.id);
  if (!template) {
    return NextResponse.json({ error: "Template not found" }, { status: 404 });
  }

  return NextResponse.json(template);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getAuthorizedUser();
  if (user instanceof NextResponse) return user;

  const service = new TemplateService();
  await service.deleteTemplate(params.id, user.id);
  return NextResponse.json({ success: true });
}
