import isAdmin from "../../middlewares/isAdmin.middleware";
import isAuthenticated from "../../middlewares/isAuthenticated.middleware";
import MessageService from "../../services/message.service";
import { UserService } from "../../services/user.service";
import { Message } from "./../../../node_modules/.prisma/client/index.d";

const Query = {
  getAllMessages: isAuthenticated(
    isAdmin(async (): Promise<Message[]> => {
      return await MessageService.getAllMessages();
    })
  ),
  getAllMessagesByUserId: isAuthenticated(
    async (_: void, { userId }: { userId: string }): Promise<Message[]> => {
      return await MessageService.getAllMessagesByUserId(userId);
    }
  ),
};

const Mutation = {
  createMessage: isAuthenticated(
    async (
      _: void,
      { messageData }: { messageData: Message }
    ): Promise<Message> => {
      return await MessageService.createMessage(messageData);
    }
  ),

  updateMessageById: isAuthenticated(
    async (
      _: void,
      { updateData }: { updateData: Message }
    ): Promise<Message> => {
      return await MessageService.updateMessageById(updateData);
    }
  ),

  deleteMessageById: isAuthenticated(
    async (_: void, { id }: { id: string }): Promise<Message> => {
      return await MessageService.deleteMessageById(id);
    }
  ),
};

const messageResolver = {
  Query,
  Mutation,
  Message: {
    sender: async (parent: Message) => {
      return await UserService.getUserById(parent.senderId);
    },
  },
};

export default messageResolver;
