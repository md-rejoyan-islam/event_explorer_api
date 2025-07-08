import type { User } from "@prisma/client";
import { GraphQLResolveInfo } from "graphql";

type Context = {
  token: string;
  user: User;
};

const isAdmin =
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
    if (context.user?.role !== "ADMIN") {
      throw new Error("Only admins can perform this action");
    }

    return next(parent, args, context, info);
  };

export default isAdmin;
