"use server";

import { CategoryService } from "@/services/category-service";
import { UserService } from "@/services/user-service";
import { hash } from "bcrypt";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6).optional().or(z.literal("")),
  confirmPassword: z.string().optional(),
});

export async function updateUserInfoAction(_: unknown, formData: FormData) {
  const result = schema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors };
  }

  const { name, email, password, confirmPassword } = result.data;

  if (password && confirmPassword && password !== confirmPassword) {
    return { errors: { confirmPassword: ["Passwords do not match"] } };
  }

  const userId = formData.get("userId") as string;

  const service = new UserService();
  service.updateUser(userId, {
    name,
    email,
    ...(password ? { password: await hash(password, 10) } : {}),
  });

  revalidatePath("/profile");

  return { success: true };
}

export async function createCategoryAction(userId: string, name: string) {
  const service = new CategoryService();
  const newCategory = await service.createCategory(userId, name);

  revalidatePath("/profile");

  return {
    id: newCategory.id,
    name: newCategory.name,
    userId,
  };
}

export async function updateCategoryAction(
  userId: string,
  categoryId: string,
  newName: string,
) {
  const service = new CategoryService();
  const updated = await service.updateCategory(userId, categoryId, newName);

  if (updated.count === 0) throw new Error("Update failed");
  return { id: categoryId, name: newName };
}

export async function deleteCategoryAction(userId: string, categoryId: string) {
  const service = new CategoryService();
  await service.deleteCategory(userId, categoryId);

  revalidatePath("/profile");
}
