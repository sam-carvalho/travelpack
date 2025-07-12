import { NextResponse } from "next/server";
import { getAuthorizedUser } from "@/app/lib/auth";
import { TemplateService } from "@/services/template-service";
import { createTemplateSchema } from "@/app/lib/validation/templates";

export async function POST(req: Request) {
  const user = await getAuthorizedUser();
  if (user instanceof NextResponse) return user;

  const body = await req.json();
  const parsed = createTemplateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const service = new TemplateService();
  const result = await service.createTemplate(user.id, parsed.data);

  return NextResponse.json(result, { status: 201 });
}

export async function GET() {
  const user = await getAuthorizedUser();
  if (user instanceof NextResponse) return user;

  const service = new TemplateService();
  const templates = await service.getTemplatesByUser(user.id);
  return NextResponse.json(templates);
}
