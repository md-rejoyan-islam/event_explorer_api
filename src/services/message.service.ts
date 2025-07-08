import type { Message } from "@prisma/client";
import createHttpError from "http-errors";
import { isValidMongoDBObjectId } from "../utils/mongodb-object-id";
import { prismaClient } from "../utils/prisma-client";

class MessageService {
  static async getAllMessages() {
    return await prismaClient.message.findMany();
  }

  static async getAllMessagesByUserId(userId: string) {
    // Validate the userId format
    if (!isValidMongoDBObjectId(userId)) {
      throw createHttpError.BadRequest("Invalid user ID format");
    }

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
    // Validate the ID format
    if (!isValidMongoDBObjectId(id)) {
      throw createHttpError.BadRequest("Invalid message ID format");
    }

    return await prismaClient.message.delete({
      where: { id },
    });
  }
}

export default MessageService;
