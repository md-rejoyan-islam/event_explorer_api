import { User } from "@prisma/client";
import { UserService } from "../../services/user.service";
import { prismaClient } from "../../utils/prisma-client";

import isAuthenticated from "../../middlewares/isAuthenticated.middleware";
import { EventService } from "../../services/event.service";
import {
  CONTEXT_TYPE,
  USER_LOGIN_PARAMS,
  USER_REGISTER_PARAMS,
} from "../../utils/types";

const Query = {
  /**
   * @description Get a user by ID
   * @access public
   * */
  getUserById: isAuthenticated(async (_: void, { id }: { id: string }) => {
    return UserService.getUserById(id);
  }),

  /**
   * @description Get all users with pagination
   * @access Admin
   * */
  allUsers: async (
    _: void,
    { page = 1, limit = 10 }: { page: number; limit: number }
  ) => {
    return UserService.allUsers(page, limit);
  },

  /**
   * @description Get the currently authenticated user
   * @access private
   * */
  me: isAuthenticated(async (_: void, __: void, context: CONTEXT_TYPE) => {
    const { user } = context;
    return user;
  }),

  /**
   * @description Get a user by email
   * @access private (Admin)
   * */
  getUserByEmail: async (_: void, { email }: { email: string }) => {
    return UserService.getUserByEmail(email);
  },

  /**
   * @description Get all users with pagination
   * @access private (Admin)
   * */
  getAllAdmins: isAuthenticated(async (_: void, __: void) => {
    return UserService.getAllAdmins();
  }),
};

const Mutation = {
  /**
   * @description Login a user
   * @access public
   * */
  userLogin: async (
    _: void,
    { loginData }: { loginData: USER_LOGIN_PARAMS }
  ) => {
    return UserService.userLogin(loginData);
  },

  /**
   * @description Register a user
   * @access public
   * */

  userRegister: async (
    _: void,
    { registerData }: { registerData: USER_REGISTER_PARAMS }
  ) => {
    return UserService.userRegister(registerData);
  },

  /**
   * @description Update user by ID
   * @access private
   * */
  updateUserById: isAuthenticated(
    async (_: void, { profileUpdate }: { profileUpdate: User }) => {
      return UserService.updateUserById(profileUpdate);
    }
  ),

  /**
   * @description Delete user by ID
   * @access private
   * */
  deleteUserById: isAuthenticated(async (_: void, { id }: { id: string }) => {
    return UserService.deleteUserById(id);
  }),

  /**
   * @description Create login token
   * @access public
   * */
  createLoginToken: async (_: void, { email }: { email: string }) => {
    return UserService.createLoginToken(email);
  },
};

const userResolver = {
  Query,
  Mutation,
  User: {
    events: async (parent: { id: string }) => {
      return EventService.getAllEventsByUserId(parent.id);
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
