"use server";

import { SignInFormSchema } from "@/app/lib/definitions";
import prisma from "@/app/lib/prisma";
import bcrypt from "bcrypt";

async function verifyLogin(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || !user.password) {
    return null;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return null;
  }

  return user;
}

export async function signInUser(_: unknown, formData: FormData) {
  const validated = SignInFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const { email, password } = validated.data;

  const user = await verifyLogin(email, password);
  if (!user) {
    return { message: "Invalid email or password. Try again." };
  }

  return { email, password };
}
