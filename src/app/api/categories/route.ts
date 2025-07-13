import { NextResponse } from "next/server";
import { getAuthorizedUser } from "@/app/lib/auth";
import { CategoryService } from "@/services/category-service";

export async function GET() {
  const user = await getAuthorizedUser();

  if (user instanceof NextResponse) {
    // If getAuthorizedUser returns a NextResponse,
    // it means there was an error (e.g., unauthorized)
    // so we return it directly
    return user;
  }

  const categoryService = new CategoryService();
  const categories = await categoryService.getAllCategories(user.id);

  return NextResponse.json(categories);
}
