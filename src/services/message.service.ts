import { Message } from "@prisma/client";
import { prismaClient } from "../utils/prisma-client";

class MessageService {
  static async getAllMessages() {
    return await prismaClient.message.findMany();
  }

  static async getAllMessagesByUserId(userId: string) {
    return await prismaClient.message.findMany({
      where: { senderId: userId },
    });
  }

  static async createMessage(messageData: Message) {
    return await prismaClient.message.create({
      data: messageData,
    });
  }

  static async updateMessageById(updateData: Message) {
    return await prismaClient.message.update({
      where: { id: updateData.id },
      data: updateData,
    });
  }

  static async deleteMessageById(id: string) {
    return await prismaClient.message.delete({
      where: { id },
    });
  }
}

export default MessageService;
