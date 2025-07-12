import { SignInFormSchema } from "@/app/lib/definitions";

export async function signInUser(_: any, formData: FormData) {
  const validated = SignInFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const { email, password } = validated.data;

  return { email, password };
}
