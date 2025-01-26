import { EnrolledEvent, Event, User } from "@prisma/client";
import { prismaClient } from "../../utils/prisma-client";

const Query = {
  allEnrolledEvents: async (): Promise<EnrolledEvent[]> => {
    return await prismaClient.enrolledEvent.findMany();
  },

  getEnrolledEventById: async (
    _: unknown,
    { id }: { id: string }
  ): Promise<EnrolledEvent | null> => {
    return await prismaClient.enrolledEvent.findUnique({
      where: { id },
    });
  },
};

const Mutation = {
  enrollEvent: async (
    _: unknown,
    { userId, eventId }: { userId: string; eventId: string }
  ): Promise<EnrolledEvent> => {
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

    // Enroll the user in the event
    const enrolledEvent = await prismaClient.enrolledEvent.create({
      data: { userId, eventId },
    });
    return enrolledEvent;
  },
};

const enrolledEventResolver = {
  Query,
  Mutation,
  EnrolledEvent: {
    user: async (parent: EnrolledEvent): Promise<User | null> => {
      return await prismaClient.user.findUnique({
        where: { id: parent.userId },
      });
    },

    event: async (parent: EnrolledEvent): Promise<Event | null> => {
      return await prismaClient.event.findUnique({
        where: { id: parent.eventId },
      });
    },
  },
};

export default enrolledEventResolver;
