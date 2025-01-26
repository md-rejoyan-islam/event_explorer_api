import { Event, User } from "@prisma/client";
import { prismaClient } from "../../utils/prisma-client";

type PageInfo = {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  perPage: number;
  nextPage: number | null;
  previousPage: number | null;
};

const Query = {
  getEventById: async (
    _: unknown,
    { id }: { id: string }
  ): Promise<Event | null> => {
    return await prismaClient.event.findUnique({ where: { id } });
  },

  allEvents: async (
    _: unknown,
    {
      page = 1,
      limit = 10,
      search = "",
    }: { page?: number; limit?: number; search?: string }
  ): Promise<{ data: Event[]; pageInfo: PageInfo }> => {
    const skip = (page - 1) * limit;
    const take = limit;

    const events = await prismaClient.event.findMany({
      skip,
      take,
      where: {
        OR: [
          {
            title: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            location: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            category: {
              contains: search,
              mode: "insensitive",
            },
          },
        ],
      },
    });

    const count = await prismaClient.event.count();

    const pageInfo: PageInfo = {
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      perPage: limit,
      nextPage: page < Math.ceil(count / limit) ? page + 1 : null,
      previousPage: page > 1 ? page - 1 : null,
    };

    return {
      data: events,
      pageInfo,
    };
  },
};

const Mutation = {
  createEvent: async (
    _: unknown,
    { eventData }: { eventData: Event },
    context: {
      status: string;
      data?: { email: string };
      error?: { message: string };
    }
  ): Promise<Event> => {
    const { status, data, error } = context;

    if (status === "error") {
      throw new Error(`${error?.message}. Please login first.`);
    } else {
      const { email } = data!;
      const userCount = await prismaClient.user.count({
        where: { email },
      });

      if (userCount !== 1) {
        throw new Error("User not found. Please register first");
      }
    }

    const event = await prismaClient.event.create({
      data: eventData,
    });

    return event;
  },

  updateEventById: async (
    _: unknown,
    args: { id: string; [key: string]: any }
  ): Promise<Event> => {
    const { id, ...update } = args;

    const eventCount = await prismaClient.event.count({
      where: { id },
    });

    if (eventCount < 1) {
      throw new Error("Event not found");
    }

    const event = await prismaClient.event.update({
      where: { id },
      data: update,
    });

    return event;
  },

  deleteEventById: async (
    _: unknown,
    { id }: { id: string }
  ): Promise<Event | null> => {
    const event = await prismaClient.event.findFirst({
      where: { id },
    });

    if (!event) {
      throw new Error("Event not found");
    }

    await prismaClient.event.delete({
      where: { id },
    });

    return event;
  },
};

const eventResolver = {
  Query,
  Mutation,
  Event: {
    organizer: async (parent: Event): Promise<User | null> => {
      const organizer = await prismaClient.user.findUnique({
        where: { id: parent.authorId },
      });

      return organizer;
    },
  },
};

export default eventResolver;
