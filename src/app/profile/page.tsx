import { getCurrentUser } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import { UpdateUserInfoForm } from "@/app/components/profile/user-info-form";
import { ManageUserCategoriesForm } from "@/app/components/profile/manage-categories-form";
import { CategoryService } from "@/services/category-service";
import { TemplateService } from "@/services/template-service";
import { ManageTemplates } from "../components/profile/manage-template";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/signin?callbackUrl=/profile");
  }

  const categoryService = new CategoryService();
  const templateService = new TemplateService();
  const [categories, templates] = await Promise.all([
    categoryService.getAllCategories(user.id),
    templateService.getTemplatesByUser(user.id),
  ]);

  return (
    <div className="min-h-md mt-16 w-7xl overflow-hidden rounded-xl bg-gradient-to-bl from-neutral-50 via-neutral-50 to-zinc-100 shadow-lg">
      <div className="p-12">
        <h2 className="text-2xl font-medium">Your Profile</h2>
      </div>

      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        <UpdateUserInfoForm user={user} />
        <ManageUserCategoriesForm userId={user.id} categories={categories} />
      </div>

      <div className="grid grid-cols-1 gap-2 pb-20 md:grid-cols-2">
        <ManageTemplates userId={user.id} templates={templates} />
      </div>
    </div>
  );
}
