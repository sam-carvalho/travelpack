import prisma from "@/app/lib/prisma";
import { User } from "@/generated/prisma";

export class UserService {
  async updateUser(userId: string, data: Partial<User>) {
    return prisma.user.update({
      where: { id: userId },
      data,
    });
  }

  async deleteUser(userId: string) {
    return prisma.user.delete({
      where: {
        id: userId,
      },
    });
  }
}
