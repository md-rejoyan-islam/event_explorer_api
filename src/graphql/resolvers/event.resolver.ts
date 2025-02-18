import { Event, User } from "@prisma/client";
import isAdmin from "../../middlewares/isAdmin.middleware";
import isAuthenticated from "../../middlewares/isAuthenticated.middleware";
import { EnrolledEventService } from "../../services/enrolled-event.service";
import { EventService } from "../../services/event.service";

const Query = {
  getEventById: async (
    _: void,
    { id }: { id: string }
  ): Promise<Event | null> => {
    return await EventService.getEventById(id);
  },

  allEvents: async (
    _: void,
    {
      page = 1,
      limit = 10,
      search = "",
      category = "",
    }: { page?: number; limit?: number; search?: string; category?: string }
  ) => {
    return await EventService.getAllEvents(page, limit, search, category);
  },

  allEventsCategory: async (): Promise<{ data: String[] }> => {
    return await EventService.getAllEventsCategory();
  },

  getAllEventsByUserId: isAuthenticated(
    isAdmin(
      async (_: void, { userId }: { userId: string }): Promise<Event[]> => {
        return await EventService.getAllEventsByUserId(userId);
      }
    )
  ),
};

const Mutation = {
  createEvent: isAuthenticated(
    isAdmin(
      async (_: void, { eventData }: { eventData: Event }): Promise<Event> => {
        return await EventService.createEvent(eventData);
      }
    )
  ),

  updateEventById: isAuthenticated(
    isAdmin(
      async (_: void, updateData: { updateData: Event }): Promise<Event> => {
        return await EventService.updateEventById(updateData.updateData);
      }
    )
  ),

  deleteEventById: isAuthenticated(
    isAdmin(async (_: void, { id }: { id: string }): Promise<Event | null> => {
      return await EventService.deleteEventById(id);
    })
  ),
};

const eventResolver = {
  Query,
  Mutation,
  Event: {
    organizer: async (parent: Event): Promise<User | null> => {
      return await EventService.getOrganizer(parent);
    },
    totalEnrolled: async (parent: Event): Promise<number> => {
      return await EnrolledEventService.totalEnrolledEventsByEventId(parent.id);
    },
  },
};

export default eventResolver;
