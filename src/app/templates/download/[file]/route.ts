import { fileName, templates, toTravelPackDocument } from "@/lib/templates";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return templates.map((t) => ({ file: fileName(t) }));
}

export async function GET(_request: Request, { params }: RouteContext<"/templates/download/[file]">) {
  const { file } = await params;
  const template = templates.find((t) => fileName(t) === file);
  if (!template) return new Response("Not found", { status: 404 });

  const body = JSON.stringify(toTravelPackDocument(template, new Date()), null, 2);
  return new Response(body, {
    headers: {
      "Content-Type": "application/vnd.travelpack+json",
      "Content-Disposition": `attachment; filename="${file}"`,
      "X-Content-Type-Options": "nosniff",
    },
  });
}
