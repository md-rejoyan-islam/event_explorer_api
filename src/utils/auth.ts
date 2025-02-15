import { User } from "@prisma/client";
import { verifyJWT } from "./jwt";
import { prismaClient } from "./prisma-client";

export const isAdmin = (user: User) => {
  const role = user.role;
  if (role !== "ADMIN") {
    throw new Error("Only admins can perform this action");
  }

  return true;
};
export const isAuthenticated = async (
  token: string
): Promise<{
  status: string;
  data: { user: User } | null;
  error: { message: string } | null;
}> => {
  if (!token) {
    throw new Error("Token not found");
  }

  try {
    const decode = verifyJWT(token) as { email: string };

    if (!decode) {
      throw new Error("Invalid token/Expired token");
    }

    // find user by email
    const user = await prismaClient.user.findUnique({
      where: {
        email: decode.email,
      },
    });

    return {
      status: "success",
      data: {
        user: {
          ...user,
          name: user?.name || null,
          id: user?.id || "",
          email: user?.email || "",
          password: user?.password || null,
          role: user?.role || "USER",
          bio: user?.bio || null,
          createdAt: user?.createdAt || null,
          updatedAt: user?.updatedAt || null,
        },
      },
      error: null,
    };
  } catch (error) {
    // console.log("error", error);
    throw new Error("Invalid token/Expired token");
  }
};
