import { EnrolledEvent, Event, User } from "@prisma/client";
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
    const event = await prismaClient.enrolledEvent.findUnique({
      where: { id },
    });
    if (!event) {
      throw new Error("Enrolled event not found");
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
    // Check if user exists
    const user: User | null = await prismaClient.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Check if event exists
    const event: Event | null = await prismaClient.event.findUnique({
      where: { id: eventId },
    });

    console.log("event", event);

    if (!event) {
      throw new Error("Event not found");
    }

    // Check if user is already enrolled
    const userEnrolled: EnrolledEvent | null =
      await prismaClient.enrolledEvent.findFirst({
        where: { userId, eventId },
      });
    if (userEnrolled) {
      throw new Error("User already enrolled");
    }

    console.log("userEnrolled", userEnrolled);

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
    // Check if user is enrolled
    const userEnrolled: EnrolledEvent | null =
      await prismaClient.enrolledEvent.findFirst({
        where: { userId, eventId },
      });
    if (!userEnrolled) {
      throw new Error("User not enrolled");
    }

    // Unenroll the user from the event
    await prismaClient.enrolledEvent.delete({
      where: { id: userEnrolled.id },
    });
    return userEnrolled;
  }
}
