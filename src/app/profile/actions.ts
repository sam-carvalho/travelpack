"use server";

import { CategoryService } from "@/services/category-service";
import { TemplateService } from "@/services/template-service";
import { UserService } from "@/services/user-service";
import prisma from "@/app/lib/prisma";
import { requireUser } from "@/app/lib/authz";
import { SignupFormSchema } from "@/app/lib/definitions";
import { CategoryNameSchema } from "@/app/lib/validation/inputs";
import { hash } from "bcrypt";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email(),
  password: SignupFormSchema.shape.password.optional().or(z.literal("")),
  confirmPassword: z.string().optional(),
});

export async function updateUserInfoAction(_: unknown, formData: FormData) {
  const user = await requireUser();

  const result = schema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password") ?? "",
    confirmPassword: formData.get("confirmPassword") ?? "",
  });

  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors };
  }

  const { name, email, password, confirmPassword } = result.data;

  if (password && password !== confirmPassword) {
    return { errors: { confirmPassword: ["Passwords do not match"] } };
  }

  if (email !== user.email) {
    const taken = await prisma.user.findUnique({ where: { email } });
    if (taken) {
      return { errors: { email: ["Email already in use"] } };
    }
  }

  const service = new UserService();
  await service.updateUser(user.id, {
    name,
    email,
    ...(password ? { password: await hash(password, 10) } : {}),
  });

  revalidatePath("/profile");

  return { success: true };
}

export async function createCategoryAction(name: string) {
  const user = await requireUser();
  const categoryName = CategoryNameSchema.parse(name);

  const service = new CategoryService();
  const newCategory = await service.createCategory(user.id, categoryName);

  revalidatePath("/profile");

  return {
    id: newCategory.id,
    name: newCategory.name,
    userId: user.id,
  };
}

export async function updateCategoryAction(categoryId: string, newName: string) {
  const user = await requireUser();
  const categoryName = CategoryNameSchema.parse(newName);

  const service = new CategoryService();
  const updated = await service.updateCategory(
    user.id,
    categoryId,
    categoryName,
  );

  if (updated.count === 0) throw new Error("Update failed");
  return { id: categoryId, name: categoryName };
}

export async function deleteCategoryAction(categoryId: string) {
  const user = await requireUser();

  const service = new CategoryService();
  await service.deleteCategory(user.id, categoryId);

  revalidatePath("/profile");
}

export async function deleteTemplateAction(templateId: string) {
  const user = await requireUser();

  const service = new TemplateService();
  await service.deleteTemplate(user.id, templateId);

  revalidatePath("/profile");
}
