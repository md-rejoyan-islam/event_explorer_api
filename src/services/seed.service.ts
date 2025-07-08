import * as fs from "fs";
import * as path from "path";

import type { Event } from "@prisma/client";
import createHttpError from "http-errors";
import { hashPassword } from "../utils/hash-password";
import { prismaClient } from "../utils/prisma-client";

class SeedService {
  // bulk user create
  static seedUsers = async (): Promise<boolean> => {
    try {
      const usersFilePath = path.resolve(__dirname, "../../data/users.json");
      const users = JSON.parse(fs.readFileSync(usersFilePath, "utf-8"));

      const usersWithHashedPassword = users.map((user: any) => {
        return {
          ...user,
          password: hashPassword(user.password),
        };
      });

      // delete all users
      await prismaClient.user.deleteMany();

      // create users
      await prismaClient.user.createMany({
        data: usersWithHashedPassword,
      });
      return true;
    } catch (error) {
      if (error instanceof Error) {
        throw createHttpError.InternalServerError(error.message);
      } else {
        throw createHttpError.InternalServerError(
          "An unexpected error occurred while seeding users."
        );
      }
    }
  };

  // bulk event create
  static seedEvents = async (): Promise<boolean> => {
    const eventsFilePath = path.resolve(__dirname, "../../data/events.json");
    const eventsData = JSON.parse(fs.readFileSync(eventsFilePath, "utf-8"));

    const events = eventsData.map((event: Event) => ({
      ...event,
      category: event.category,
    }));

    try {
      // delete all events
      await prismaClient.event.deleteMany();

      // create events
      await prismaClient.event.createMany({
        data: events,
      });

      return true;
    } catch (error) {
      if (error instanceof Error) {
        throw createHttpError.InternalServerError(error.message);
      } else {
        throw createHttpError.InternalServerError(
          "An unexpected error occurred while seeding events."
        );
      }
    }
  };

  // bulk enrolled event create
  static seedEnrolledEvents = async (): Promise<boolean> => {
    const enrolledEventsFilePath = path.resolve(
      __dirname,
      "../../data/enrolled.json"
    );
    const enrolledEvents = JSON.parse(
      fs.readFileSync(enrolledEventsFilePath, "utf-8")
    );

    try {
      // delete all enrolled events
      await prismaClient.enrolledEvent.deleteMany();

      // create enrolled events
      await prismaClient.enrolledEvent.createMany({
        data: enrolledEvents,
      });

      return true;
    } catch (error) {
      if (error instanceof Error) {
        throw createHttpError.InternalServerError(error.message);
      } else {
        throw createHttpError.InternalServerError(
          "An unexpected error occurred while seeding enrolled events."
        );
      }
    }
  };
}

export default SeedService;
