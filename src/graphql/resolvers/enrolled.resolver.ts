import { EnrolledEvent, Event, User } from "@prisma/client";
import isAuthenticated from "../../middlewares/isAuthenticated.middleware";
import { EnrolledEventService } from "../../services/enrolled-event.service";
import { EventService } from "../../services/event.service";
import { UserService } from "../../services/user.service";

const Query = {
  /**
   * @description Get all enrolled events
   * @access protected
   * */
  allEnrolledEvents: isAuthenticated(async (): Promise<EnrolledEvent[]> => {
    return await EnrolledEventService.getAllEnrolledEvents();
  }),

  /**
   * @description Get an enrolled event by ID
   * @access protected
   * */
  getEnrolledEventById: isAuthenticated(
    async (
      _: unknown,
      { id }: { id: string }
    ): Promise<EnrolledEvent | null> => {
      return await EnrolledEventService.getEnrolledEventById(id);
    }
  ),

  /**
   * @description Check if a user is enrolled in an event
   * @access protected
   * */
  checkEnrolledEvent: isAuthenticated(
    async (
      _: unknown,
      { eventId, userId }: { eventId: string; userId: string }
    ): Promise<boolean> => {
      return await EnrolledEventService.checkEnrolledEvent(eventId, userId);
    }
  ),

  /**
   * @description Get all enrolled events by the creator's ID
   * @access protected
   * */
  getEnrolledEventsByCreaterId: isAuthenticated(
    async (
      _: unknown,
      { authorId }: { authorId: string }
    ): Promise<EnrolledEvent[]> => {
      return await EnrolledEventService.getEnrolledEventsByCreaterId(authorId);
    }
  ),

  /**
   * @description Get all enrolled events by a specific user ID
   * @access protected
   * */
  getEnrolledEventsByUserId: isAuthenticated(
    async (
      _: unknown,
      { userId }: { userId: string }
    ): Promise<EnrolledEvent[]> => {
      return await EnrolledEventService.getEnrolledEventsByUserId(userId);
    }
  ),
  /**
   * @description Get total enrolled events by event ID
   * @access protected
   * */
  totalEnrolledEventsByEventId: isAuthenticated(
    async (_: unknown, { eventId }: { eventId: string }): Promise<number> => {
      return await EnrolledEventService.totalEnrolledEventsByEventId(eventId);
    }
  ),
};

const Mutation = {
  /**
   * @description Enroll in an event
   * @access protected
   * */
  enrollEvent: isAuthenticated(
    async (
      _: unknown,
      { userId, eventId }: { userId: string; eventId: string }
    ): Promise<EnrolledEvent> => {
      return await EnrolledEventService.enrollEvent(userId, eventId);
    }
  ),
  /**
   * @description Unenroll in an event
   * @access protected
   * */
  unenrollEvent: isAuthenticated(
    async (
      _: unknown,
      { userId, eventId }: { userId: string; eventId: string }
    ): Promise<EnrolledEvent> => {
      return await EnrolledEventService.unenrollEvent(userId, eventId);
    }
  ),
};

const enrolledEventResolver = {
  Query,
  Mutation,
  EnrolledEvent: {
    user: async (parent: EnrolledEvent): Promise<User | null> => {
      return await UserService.getUserById(parent.userId);
    },

    event: async (parent: EnrolledEvent): Promise<Event | null> => {
      return await EventService.getEventById(parent.eventId);
    },
  },
};

export default enrolledEventResolver;
