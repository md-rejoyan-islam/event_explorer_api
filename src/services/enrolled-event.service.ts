import type { EnrolledEvent, Event, User } from "@prisma/client";
import createHttpError from "http-errors";
import { isValidMongoDBObjectId } from "../utils/mongodb-object-id";
import { prismaClient } from "../utils/prisma-client";

export class EnrolledEventService {
  /**
   * @static
   * @type Query
   * @returns EnrolledEvent[]
   * @description Get all enrolled events
   * @access protected
   * */
  static async getAllEnrolledEvents(): Promise<EnrolledEvent[]> {
    return await prismaClient.enrolledEvent.findMany();
  }

  /**
   * @static
   * @type Query
   * @param id
   * @returns EnrolledEvent | null
   * @description Get an enrolled event by ID
   * @access protected
   * */
  static async getEnrolledEventById(id: string): Promise<EnrolledEvent | null> {
    // Validate the ID format
    if (!isValidMongoDBObjectId(id)) {
      throw createHttpError.BadRequest("Invalid ID format");
    }

    const event = await prismaClient.enrolledEvent.findUnique({
      where: { id },
    });

    if (!event) {
      throw createHttpError.NotFound("Enrolled event not found");
    }
    return event;
  }

  /**
   * @static
   * @type Query
   * @param eventId
   * @param userId
   * @returns boolean
   * @description Check if a user is enrolled in an event
   * @access protected
   * */

  static async checkEnrolledEvent(
    eventId: string,
    userId: string
  ): Promise<boolean> {
    const enrolledEvent = await prismaClient.enrolledEvent.findFirst({
      where: { eventId, userId },
    });
    return enrolledEvent ? true : false;
  }

  /**
   * @static
   * @type Query
   * @param authorId
   * @returns EnrolledEvent[]
   * @description Get all enrolled events by the creator's ID
   * @access protected
   * */
  static async getEnrolledEventsByCreaterId(
    authorId: string
  ): Promise<EnrolledEvent[]> {
    return await prismaClient.enrolledEvent.findMany({
      where: {
        event: {
          authorId,
        },
      },
    });
  }

  /**
   * @static
   * @type Query
   * @param userId
   * @returns EnrolledEvent[]
   * @description Get all enrolled events by a specific user ID
   * @access protected
   * */
  static async getEnrolledEventsByUserId(
    userId: string
  ): Promise<EnrolledEvent[]> {
    // Validate the ID format
    if (!isValidMongoDBObjectId(userId)) {
      throw createHttpError.BadRequest("Invalid ID format");
    }

    return await prismaClient.enrolledEvent.findMany({
      where: { userId },
    });
  }

  /**
   * @static
   * @type Mutation
   * @param userId
   * @param eventId
   * @returns EnrolledEvent
   * @description Enroll a user in an event
   * @access protected
   * */
  static async enrollEvent(
    userId: string,
    eventId: string
  ): Promise<EnrolledEvent> {
    // Validate the ID formats
    if (!isValidMongoDBObjectId(userId) || !isValidMongoDBObjectId(eventId)) {
      throw createHttpError.BadRequest("Invalid ID format");
    }

    // Check if user exists
    const user: User | null = await prismaClient.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw createHttpError.NotFound("User not found");
    }

    // Check if event exists
    const event: Event | null = await prismaClient.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      throw createHttpError.NotFound("Event not found");
    }

    // Check if user is already enrolled
    const userEnrolled: EnrolledEvent | null =
      await prismaClient.enrolledEvent.findFirst({
        where: { userId, eventId },
      });
    if (userEnrolled) {
      throw createHttpError.Conflict("User already enrolled in this event");
    }

    // Enroll the user in the event
    const enrolledEvent = await prismaClient.enrolledEvent.create({
      data: { userId, eventId },
    });
    return enrolledEvent;
  }

  /**
   * @static
   * @type Mutation
   * @param userId
   * @param eventId
   * @returns EnrolledEvent
   * @description Unenroll a user from an event
   * @access protected
   * */
  static async unenrollEvent(
    userId: string,
    eventId: string
  ): Promise<EnrolledEvent> {
    // Validate the ID formats
    if (!isValidMongoDBObjectId(userId) || !isValidMongoDBObjectId(eventId)) {
      throw createHttpError.BadRequest("Invalid ID format");
    }

    // Check if user is enrolled
    const userEnrolled: EnrolledEvent | null =
      await prismaClient.enrolledEvent.findFirst({
        where: { userId, eventId },
      });
    if (!userEnrolled) {
      throw createHttpError.NotFound("User not enrolled in this event");
    }

    // Unenroll the user from the event
    await prismaClient.enrolledEvent.delete({
      where: { id: userEnrolled.id },
    });
    return userEnrolled;
  }

  static async totalEnrolledEventsByEventId(eventId: string): Promise<number> {
    const total = await prismaClient.enrolledEvent.count({
      where: { eventId },
    });
    return total;
  }
}
