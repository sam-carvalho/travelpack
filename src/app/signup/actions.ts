"use server";

import prisma from "@/app/lib/prisma";
import { hash } from "bcrypt";
import { SignupFormSchema, FormState } from "@/app/lib/definitions";
import { redirect } from "next/navigation";

export async function createUser(state: FormState, formData: FormData) {
  const validatedFields = SignupFormSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, email, password } = validatedFields.data;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return {
        errors: { email: ["Email already in use"] },
      };
    }

    const hashedPassword = await hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
  } catch (error) {
    console.error("User creation failed:", error);
    return {
      message: "Something went wrong. Please try again.",
    };
  }

  redirect("/signin");
}
