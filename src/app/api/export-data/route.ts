import { getCurrentUser } from "@/app/lib/auth";
import { ExportService } from "@/services/export-service";
import { attachmentDisposition } from "@/app/utils/contentDisposition";

// Downloads the signed-in user's data as a `.travelpack` (schema v1) file.
// /api routes are excluded from the auth middleware, so authenticate here.
export async function GET() {
  const user = await getCurrentUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const data = await new ExportService().exportUserData(user.id);
  const date = data.exportedAt.slice(0, 10);

  return new Response(JSON.stringify(data, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": attachmentDisposition(
        `travelpack-export-${date}.travelpack`,
      ),
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
