import { User } from "@prisma/client";
import { GraphQLResolveInfo } from "graphql";
import { verifyJWT } from "../utils/jwt";
import { prismaClient } from "../utils/prisma-client";

type Context = {
  token: string;
  user: User;
};

const isAuthenticated =
  <TArgs, TParent, TResult>(
    next: (
      parent: TParent,
      args: TArgs,
      context: Context,
      info: GraphQLResolveInfo
    ) => Promise<TResult>
  ) =>
  async (
    parent: TParent,
    args: TArgs,
    context: Context,
    info: GraphQLResolveInfo
  ): Promise<TResult> => {
    const { token } = context;

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

      context.user = {
        ...user,
        name: user?.name || null,
        id: user?.id || "",
        email: user?.email || "",
        password: user?.password || null,
        role: user?.role || "USER",
        bio: user?.bio || null,
        createdAt: user?.createdAt || null,
        updatedAt: user?.updatedAt || null,
      };

      return next(parent, args, context, info);
    } catch (error) {
      // console.log("error", error);
      throw new Error("Invalid token/Expired token");
    }
  };

export default isAuthenticated;
