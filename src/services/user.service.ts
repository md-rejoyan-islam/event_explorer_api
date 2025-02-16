import { User } from "@prisma/client";
import { comparePassword, hashPassword } from "../utils/hash-password";
import { createJWT } from "../utils/jwt";
import { prismaClient } from "../utils/prisma-client";
import {
  PAGE_INFO,
  USER_LOGIN_PARAMS,
  USER_REGISTER_PARAMS,
} from "../utils/types";

export class UserService {
  /**
   * @static
   * @type Query
   * @param id
   * @returns  User | null
   * @description Get a user by ID
   * @access public
   */
  static async getUserById(id: string): Promise<User | null> {
    const user = await prismaClient.user.findUnique({ where: { id } });

    return user
      ? { ...user, password: user?.password ?? "", role: user.role ?? "USER" }
      : null;
  }

  /**
   * @static
   * @type Query
   * @param page
   * @param limit
   * @returns { data: User[]; pageInfo: PageInfo }
   * @description Get all users with pagination
   * @access Admin
   */
  static async allUsers(
    page: number = 1,
    limit: number = 10
  ): Promise<{
    data: User[];
    pageInfo: PAGE_INFO;
  }> {
    const skip = (page - 1) * limit;
    const take = limit;

    const users = await prismaClient.user.findMany({ skip, take });
    const count = await prismaClient.user.count();

    const pageInfo = {
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      perPage: limit,
      nextPage: page < Math.ceil(count / limit) ? page + 1 : null,
      previousPage: page > 1 ? page - 1 : null,
    };

    return { data: users, pageInfo };
  }

  // get user by email
  /**
   * @static
   * @type Query
   * @param email
   * @returns User | null
   * @description Get a user by email
   * @access Admin
   * */
  static async getUserByEmail(email: string): Promise<User | null> {
    const user = await prismaClient.user.findUnique({ where: { email } });

    return user
      ? { ...user, password: user?.password ?? "", role: user.role ?? "USER" }
      : null;
  }

  /**
   * @static
   * @type Query
   * @returns {Promise<User[]>}
   * @description Get all admins
   * @access Admin
   * */
  static async getAllAdmins(): Promise<User[]> {
    return prismaClient.user.findMany({ where: { role: "ADMIN" } });
  }

  /**
   * @static
   * @type Mutation
   * @param { email, password, isAdmin }
   * @returns {Promise<{ token: string }>}
   * @description Login user
   * @access public
   */

  static async userLogin({
    email,
    password,
    isAdmin,
  }: USER_LOGIN_PARAMS): Promise<{ token: string }> {
    const user = await prismaClient.user.findUnique({ where: { email } });

    if (!user) throw new Error("User not found");
    if (!user.password) throw new Error("Please login with provider");

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) throw new Error("Wrong password");

    if (isAdmin && user.role !== "ADMIN")
      throw new Error("User is not an admin");
    if (!isAdmin && user.role === "ADMIN") throw new Error("User is an admin");

    const jwtToken = createJWT({ id: user.id, email: user.email });
    return { token: jwtToken };
  }

  /**
   * @static
   * @type Mutation
   * @param registerData
   * @returns {Promise<User>}
   * @description Register user
   * @access public
   * */
  static async userRegister(registerData: USER_REGISTER_PARAMS): Promise<User> {
    const { email } = registerData;
    const existingUser = await prismaClient.user.findUnique({
      where: { email },
    });

    if (existingUser) throw new Error("User already exists");

    const hashedPassword = await hashPassword(registerData.password);
    const user = await prismaClient.user.create({
      data: { ...registerData, password: hashedPassword },
    });

    return user;
  }

  /**
   * @static
   * @type Mutation
   * @param profileUpdate
   * @returns {Promise<User>}
   * @description Update user by ID
   * @access protected
   * */
  static async updateUserById(profileUpdate: User): Promise<User> {
    const { id, ...update } = profileUpdate;
    return prismaClient.user.update({ where: { id }, data: update });
  }

  /**
   * @static
   * @type Mutation
   * @param id
   * @returns {Promise<User | null>}
   * @description Delete user by ID
   * @access protected
   * */
  static async deleteUserById(id: string): Promise<User | null> {
    return prismaClient.user.delete({ where: { id } });
  }

  /**
   * @static
   * @type Mutation
   * @param email
   * @returns {string}
   * @description Create login token
   * @access public
   * */
  static createLoginToken(email: string): string {
    return createJWT({ email });
  }
}
