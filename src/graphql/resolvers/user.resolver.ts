import { User } from "@prisma/client";
import { isAdmin, isAuthenticated } from "../../utils/auth";
import { comparePassword, hashPassword } from "../../utils/hash-password";
import { createJWT } from "../../utils/jwt";
import { prismaClient } from "../../utils/prisma-client";

interface Context {
  token: string;
}

interface PaginationArgs {
  page?: number;
  limit?: number;
}

interface LoginData {
  email: string;
  password: string;
  isAdmin: boolean;
}

interface RegisterData {
  email: string;
  password: string;
  [key: string]: any;
}

const Query = {
  getUserById: async (_: void, { id }: { id: string }, context: Context) => {
    const { token } = context;

    await isAuthenticated(token);

    return prismaClient.user.findUnique({ where: { id } });
  },
  allUsers: async (_: void, { page = 1, limit = 10 }: PaginationArgs) => {
    const skip = (page - 1) * limit;
    const take = limit;

    const users = await prismaClient.user.findMany({
      skip,
      take,
    });

    const count = await prismaClient.user.count();

    const pageInfo = {
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      perPage: limit,
      nextPage: page < Math.ceil(count / limit) ? page + 1 : null,
      previousPage: page > 1 ? page - 1 : null,
    };

    return {
      data: users,
      pageInfo,
    };
  },

  me: async (_: void, __: void, context: Context) => {
    const { token } = context;

    const { data } = await isAuthenticated(token);

    if (!data) {
      throw new Error("Authentication failed");
    }
    return data.user;
  },
  getUserByEmail: async (_: void, { email }: { email: string }) =>
    prismaClient.user.findUnique({ where: { email } }),

  getAllAdmins: async (_: void, __: void, context: Context) => {
    const { token } = context;
    const { data } = await isAuthenticated(token);

    if (!data) {
      throw new Error("Authentication failed");
    }
    if (data.user) isAdmin(data.user);

    return prismaClient.user.findMany({ where: { role: "ADMIN" } });
  },
};

const Mutation = {
  userLogin: async (
    _: void,
    { loginData }: { loginData: LoginData }
  ): Promise<{ token: string }> => {
    const { email, password } = loginData;
    const user = await prismaClient.user.findUnique({ where: { email } });

    if (!user) {
      throw new Error("User not found");
    }
    if (!user.password) {
      throw new Error("Please login with provider");
    }

    const isMatch = await comparePassword(password, user.password);

    if (!isMatch) {
      throw new Error("Wrong password");
    }

    if (loginData.isAdmin && user.role !== "ADMIN") {
      throw new Error("User is not an admin");
    } else if (!loginData.isAdmin && user.role === "ADMIN") {
      throw new Error("User is an admin");
    }

    const jwtToken = createJWT({ id: user.id, email: user.email });

    return {
      token: jwtToken,
    };
  },

  userRegister: async (
    _: void,
    { registerData }: { registerData: RegisterData }
  ) => {
    const { email } = registerData;

    const existingUser = await prismaClient.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error("User already exists");
    }

    const user = await prismaClient.user.create({
      data: {
        ...registerData,
        password: await hashPassword(registerData.password),
      },
    });

    return user;
  },

  updateUserById: async (
    _: void,
    { profileUpdate }: { profileUpdate: User }
  ) => {
    const { id, ...update } = profileUpdate;

    const user = await prismaClient.user.update({
      where: { id },
      data: update,
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  },

  deleteUserById: async (_: void, { id }: { id: string }) => {
    const user = await prismaClient.user.delete({ where: { id } });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  },
  createLoginToken: async (_: void, { email }: { email: string }) => {
    const token = createJWT({ email });
    return token;
  },
};

const userResolver = {
  Query,
  Mutation,
  User: {
    events: async (parent: { id: string }) => {
      const events = await prismaClient.event.findMany({
        where: { authorId: parent.id },
      });

      return events;
    },

    enrolledEvents: async (parent: { id: string }) => {
      const enrolledEvents = await prismaClient.enrolledEvent.findMany({
        where: { userId: parent.id },
      });
      return enrolledEvents;
    },
  },
};

export default userResolver;
