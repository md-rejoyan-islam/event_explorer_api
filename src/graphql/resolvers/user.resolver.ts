import { User } from "@prisma/client";
import { comparePassword, hashPassword } from "../../utils/hash-password";
import { createJWT } from "../../utils/jwt";
import { prismaClient } from "../../utils/prisma-client";

interface Context {
  status: string;
  data?: { email: string };
  error?: { message: string };
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
  getUserById: async (_: unknown, { id }: { id: string }) =>
    prismaClient.user.findUnique({ where: { id } }),

  allUsers: async (_: unknown, { page = 1, limit = 10 }: PaginationArgs) => {
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

  me: async (_: unknown, __: unknown, context: Context) => {
    const { status, data, error } = context;

    if (status === "error") {
      throw new Error(`${error?.message}. Please login first.`);
    }

    const email = data?.email;

    if (!email) {
      throw new Error("No email provided in context");
    }

    const user = await prismaClient.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  },
  getUserByEmail: async (_: unknown, { email }: { email: string }) =>
    prismaClient.user.findUnique({ where: { email } }),

  getAllAdmins: async () =>
    prismaClient.user.findMany({ where: { role: "ADMIN" } }),
};

const Mutation = {
  userLogin: async (
    _: unknown,
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
    _: unknown,
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
    _: unknown,
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

  deleteUserById: async (_: unknown, { id }: { id: string }) => {
    const user = await prismaClient.user.delete({ where: { id } });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
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
