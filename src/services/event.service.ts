import type { Event, User } from "@prisma/client";
import createHttpError from "http-errors";
import { isValidMongoDBObjectId } from "../utils/mongodb-object-id";
import { prismaClient } from "../utils/prisma-client";
import { PAGE_INFO } from "../utils/types";

export class EventService {
  /**
   * @static
   * @type Query
   * @param id
   * @returns  Event | null
   * @description Get an event by ID
   * @access public
   * */
  static async getEventById(id: string): Promise<Event | null> {
    // Validate the ID format
    if (!isValidMongoDBObjectId(id)) {
      throw createHttpError.BadRequest("Invalid ID format");
    }
    const event = await prismaClient.event.findUnique({
      where: { id },
    });

    if (!event) throw createHttpError.NotFound("Event not found");

    return event;
  }

  /**
   * @static
   * @type Query
   * @param page
   * @param limit
   * @param search
   * @param category
   * @returns { data: Event[]; pageInfo: PAGE_INFO }
   * @description Get all events with pagination, search, and category filter
   * @access public
   * */
  static async getAllEvents(
    page = 1,
    limit = 10,
    search = "",
    category = ""
  ): Promise<{ data: Event[]; pageInfo: PAGE_INFO }> {
    const skip = (page - 1) * limit;
    const take = limit;

    const events = await prismaClient.event.findMany({
      skip,
      take,
      where: {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
          { location: { contains: search, mode: "insensitive" } },
          { category: { contains: search, mode: "insensitive" } },
        ],
        category: {
          contains: category,
          mode: "insensitive",
        },
      },
    });

    const count = await prismaClient.event.count();

    const pageInfo: PAGE_INFO = {
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
  }

  /**
   * @static
   * @type Query
   * @returns { data: String[] }
   * @description Get all unique event categories
   * @access public
   * */
  static async getAllEventsCategory(): Promise<{ data: string[] }> {
    const results: {
      category: string;
    }[] = await prismaClient.event.findMany({
      select: {
        category: true,
      },
    });

    return {
      data: [...new Set(results?.map((result) => result.category))],
    };
  }

  /**
   * @static
   * @type Query
   * @param userId
   * @returns Event[]
   * @description Get all events by a specific user ID
   * @access protected (Admin)
   * */
  static async getAllEventsByUserId(userId: string): Promise<Event[]> {
    // Validate the ID format
    if (!isValidMongoDBObjectId(userId)) {
      throw createHttpError.BadRequest("Invalid ID format");
    }

    return await prismaClient.event.findMany({
      where: { authorId: userId },
    });
  }

  /**
   * @static
   * @type Mutation
   * @param eventData
   * @returns Event
   * @description Create a new event
   * @access protected (Admin)
   * */
  static async createEvent(eventData: Event): Promise<Event> {
    return await prismaClient.event.create({
      data: { ...eventData, category: eventData.category.toLowerCase() },
    });
  }

  /**
   * @static
   * @type Mutation
   * @param updateData
   * @returns Event
   * @description Update event by ID
   * @access protected (Admin)
   * */
  static async updateEventById(updateData: Event): Promise<Event> {
    const { id, ...update } = updateData;

    if (update.category) {
      update.category = update.category.toLowerCase();
    }

    const eventCount = await prismaClient.event.count({
      where: { id },
    });

    if (eventCount < 1) {
      throw createHttpError.NotFound("Event not found");
    }

    return await prismaClient.event.update({
      where: { id },
      data: update,
    });
  }

  /**
   * @static
   * @type Mutation
   * @param id
   * @returns Event | null
   * @description Delete event by ID
   * @access protected (Admin)
   * */
  static async deleteEventById(id: string): Promise<Event | null> {
    const event = await prismaClient.event.findFirst({
      where: { id },
    });

    if (!event) {
      throw createHttpError.NotFound("Event not found");
    }

    await prismaClient.event.delete({
      where: { id },
    });

    return event;
  }

  /**
   * @static
   * @type Query
   * @param parent
   * @returns User | null
   * @description Get the organizer of an event
   * @access public
   * */
  static async getOrganizer(parent: Event): Promise<User | null> {
    return await prismaClient.user.findUnique({
      where: { id: parent.authorId },
    });
  }
}
