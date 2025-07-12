import { NextRequest, NextResponse } from "next/server";
import { getAuthorizedUser } from "@/app/lib/auth";
import { searchReportsQuerySchema } from "@/app/lib/validation/reports";
import { SearchService } from "@/services/search-service";

export async function GET(req: NextRequest) {
  const user = await getAuthorizedUser();
  if (user instanceof NextResponse) return user;

  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");

  const validation = searchReportsQuerySchema.safeParse({ q: query });
  if (!validation.success) {
    return NextResponse.json(
      { error: validation.error.format() },
      { status: 400 }
    );
  }

  const searchService = new SearchService();
  const results = await searchService.searchReports(user.id, validation.data.q);

  return NextResponse.json(results);
}
